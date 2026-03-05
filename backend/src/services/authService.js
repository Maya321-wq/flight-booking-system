const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateVerificationCode = require('../utils/generateVerificationCode');
const { sendVerificationEmail } = require('../utils/emailSender');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const verificationCode = generateVerificationCode();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationCode,
    verificationCodeExpires,
  });

  await sendVerificationEmail(email, name, verificationCode);

  return user;
};

const verifyEmail = async ({ email, code }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error('Email is already verified');
    error.statusCode = 400;
    throw error;
  }

  if (user.verificationCode !== code) {
    const error = new Error('Invalid verification code');
    error.statusCode = 400;
    throw error;
  }

  if (user.verificationCodeExpires < new Date()) {
    const error = new Error('Verification code has expired');
    error.statusCode = 400;
    throw error;
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  await user.save();

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error('Please verify your email before logging in');
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, user };
};

module.exports = { registerUser, verifyEmail, loginUser };
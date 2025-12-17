import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendEmail } from '../utils/sendEmail';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

export const register = async (input: RegisterInput) => {
  const user = await User.findOne({ email: input.email });

  if (user) {
    throw new Error('User already exists, login instead');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const newUser = await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: newUser.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );

  return {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    token,
  };
};

export const login = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email });

  if (!user) {
    throw new Error('User does not exist, Register!');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password!');
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token,
  };
};

export const requestOtp = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  user.otp = otp;
  user.otpExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  sendEmail({ user, otp });
};

export const resetPassword = async (input: ResetPasswordInput) => {
  const user = await User.findOne({ email: input.email });

  if (!user) {
    throw new Error('User not found');
  }

  if (input.otp !== user.otp) {
    throw new Error('Invalid OTP');
  }

  if (Date.now() > Number(user.otpExpiry)) {
    throw new Error('OTP has expired');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
};
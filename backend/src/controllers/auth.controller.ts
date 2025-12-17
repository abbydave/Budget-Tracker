import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

  try {
    const result = await AuthService.register({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      message: "Registered Successfuly",
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message === "User already exists, login instead" ? 409 : 500;
    res.status(statusCode).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

  try {
    const result = await AuthService.login({ email, password });

    res.status(201).json({
      message: "Sucessfully Logged In",
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message === "User does not exist, Register!" ? 409 : 401;
    res.status(statusCode).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

export const requestOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await AuthService.requestOtp(email);

    res.status(200).json({
      message: "Email sent successfully",
      success: true,
      data: null,
    });
  } catch (error: any) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  if (!otp || !password || !email) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

  try {
    await AuthService.resetPassword({ email, otp, password });

    res.status(200).json({
      message: "Password successfully updated",
      success: true,
      data: null,
    });
  } catch (error: any) {
    const statusCode = error.message === "User not found" ? 404 : 401;
    res.status(statusCode).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};
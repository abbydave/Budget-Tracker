import { Request, Response } from 'express';
import * as ProfileService from '../services/profile.service';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await ProfileService.getProfile(userId.toString());

    res.status(200).json({
      message: "Retrieved successfuly",
      success: true,
      data: profile,
    });
  } catch (error: any) {
    const statusCode = error.message === 'User does not exist' ? 400 : 500;
    res.status(statusCode).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(422).json({
        message: "All fields required",
        success: false,
        data: null,
      });
    }

    const profile = await ProfileService.updateProfile(userId.toString(), {
      firstName,
      lastName,
      email,
    });

    res.status(200).json({
      message: "Updated successfuly",
      success: true,
      data: profile,
    });
  } catch (error: any) {
    const statusCode = error.message === 'User does not exist' ? 401 : 500;
    res.status(statusCode).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};
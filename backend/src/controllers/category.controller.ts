import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type } = req.body;

    // Basic Validation
    if (!name || !type) {
        return res.status(400).json({ error: 'Name and Type are required' });
    }

    const category = await CategoryService.createCategory({
      userId: userId.toString(),
      name,
      type,
    });

    res.status(201).json({
      status: 'success',
      data: category,
    });
  } catch (error: any) {
    const statusCode = error.message === 'Category already exists' ? 409 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const type = req.query.type as 'expense' | 'income' | undefined;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const categories = await CategoryService.getUserCategories(userId.toString(), type);

    res.status(200).json({
      status: 'success',
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
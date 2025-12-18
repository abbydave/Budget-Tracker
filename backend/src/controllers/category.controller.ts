import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';

// Helper to map _id -> id
const mapId = (obj: any) => {
  if (!obj) return null;
  const plain = obj.toObject ? obj.toObject() : obj;
  const { _id, ...rest } = plain;
  return { id: _id, ...rest };
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and Type are required',
        data: null,
      });
    }

    const category = await CategoryService.createCategory({
      userId: userId.toString(),
      name,
      type,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: mapId(category),
    });
  } catch (error: any) {
    const statusCode = error.message === 'Category already exists' ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const type = req.query.type as 'expense' | 'income' | undefined;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const categories = await CategoryService.getUserCategories(userId.toString(), type);

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories.map(mapId),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const { id } = req.params;
    const { name, type } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    if (!name && !type) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update',
        data: null,
      });
    }

    const category = await CategoryService.updateCategory({
      categoryId: id,
      userId: userId.toString(),
      name,
      type,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: mapId(category),
    });
  } catch (error: any) {
    const statusCode = error.message === 'Category not found' ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    await CategoryService.deleteCategory(id, userId.toString());

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (error: any) {
    const statusCode =
      error.message === 'Category is in use and cannot be deleted'
        ? 409
        : error.message === 'Category not found'
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

import mongoose from 'mongoose';
import Category, { ICategory } from '../models/Category';

interface CreateCategoryInput {
  userId: string;
  name: string;
  type: 'expense' | 'income';
}

// Create a Category
export const createCategory = async (input: CreateCategoryInput): Promise<ICategory> => {
  // Check for duplicates
  const existing = await Category.findOne({
    userId: new mongoose.Types.ObjectId(input.userId),
    name: input.name,
    type: input.type,
  });

  if (existing) {
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    userId: new mongoose.Types.ObjectId(input.userId),
    name: input.name,
    type: input.type,
  });

  return category;
};

// Get User Categories
export const getUserCategories = async (userId: string, type?: 'expense' | 'income') => {
  const query: any = { userId: new mongoose.Types.ObjectId(userId) };

  if (type) {
    query.type = type;
  }

  return await Category.find(query).sort({ name: 1 });
};
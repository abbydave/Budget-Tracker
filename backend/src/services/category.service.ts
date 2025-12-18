import mongoose from 'mongoose';
import Category, { ICategory } from '../models/Category';
import { Transaction } from "../models/Transaction";


interface CreateCategoryInput {
  userId: string;
  name: string;
  type: 'expense' | 'income';
}

interface UpdateCategoryInput {
  categoryId: string;
  userId: string;
  name?: string;
  type?: "expense" | "income";
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


export const updateCategory = async (
  input: UpdateCategoryInput
): Promise<ICategory | null> => {
  const categoryObjectId = new mongoose.Types.ObjectId(input.categoryId);
  const userObjectId = new mongoose.Types.ObjectId(input.userId);

  const category = await Category.findOne({
    _id: categoryObjectId,
    userId: userObjectId,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const typeChanged = input.type && input.type !== category.type;

  if (input.name !== undefined) category.name = input.name;
  if (input.type !== undefined) category.type = input.type;

  await category.save();

  // 🔁 Update all transactions using this category if type changed
  if (typeChanged) {
    await Transaction.updateMany(
      { categoryId: categoryObjectId, userId: userObjectId },
      { $set: { type: input.type } }
    );
  }

  return category;
};


export const deleteCategory = async (
  categoryId: string,
  userId: string
): Promise<void> => {
  const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const transactionCount = await Transaction.countDocuments({
    categoryId: categoryObjectId,
    userId: userObjectId,
  });

  if (transactionCount > 0) {
    throw new Error("Category is in use and cannot be deleted");
  }

  const deleted = await Category.findOneAndDelete({
    _id: categoryObjectId,
    userId: userObjectId,
  });

  if (!deleted) {
    throw new Error("Category not found");
  }
};

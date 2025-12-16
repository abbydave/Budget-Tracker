import { Request, Response } from "express";
import * as TransactionService from "../services/transaction.service";
import { TransactionType } from "../models/Transaction";
import Category from "../models/Category";

export const create = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { categoryId, type, amount, note, date } = req.body;

        if (!categoryId || !type || !amount || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const transaction = await TransactionService.create({
            userId,
            categoryId,
            type,
            amount,
            note,
            date: new Date(date),
        });

        return res.status(201).json(transaction);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { startDate, endDate, type, categoryId } = req.query;

        const filters = {
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            type: type as TransactionType | undefined,
            categoryId: categoryId as string | undefined,
        };

        const transactions = await TransactionService.findAll(userId, filters);
        return res.json(transactions);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const updates = req.body;

        // Convert date string to Date object if present
        if (updates.date) {
            updates.date = new Date(updates.date);
        }

        const transaction = await TransactionService.update(id, userId, updates);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.json(transaction);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const transaction = await TransactionService.deleteTransaction(id, userId);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.json({ message: "Transaction deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

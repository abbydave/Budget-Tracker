import { Request, Response } from "express";
import * as TransactionService from "../services/transaction.service";
import { TransactionType } from "../models/Transaction";
import Category from "../models/Category";


export const create = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: null,
            });
        }

        const { categoryId, amount, note, date } = req.body;

        if (!categoryId || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                data: null,
            });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                data: null,
            });
        }

        const transaction = await TransactionService.create({
            userId,
            categoryId,
            type: category.type,
            amount,
            note,
            date: new Date(date),
        });

        const transactionObj = transaction.toObject ? transaction.toObject() : transaction;

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: {
                ...transactionObj,
                id: transactionObj._id,
                category: {
                    _id: category._id,
                    name: category.name,
                    type: category.type,
                },
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: null,
            });
        }

        const { startDate, endDate, type, categoryId } = req.query;

        const filters = {
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            type: type as TransactionType | undefined,
            categoryId: categoryId as string | undefined,
        };

        const transactions = await TransactionService.findAll(userId, filters);
        
        const formattedTransactions = transactions.map((tx: any) => {
            const { categoryId, _id, ...rest } = tx.toObject ? tx.toObject() : tx;

                return {
                    id: _id,
                    ...rest,
                    category: categoryId,
                };
});
        return res.json({
            success: true,
            message: "Transactions fetched successfully",
            data: formattedTransactions,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: null,
            });
        }

        const { id } = req.params;
        const {amount, note, date} = req.body;

        const transaction = await TransactionService.update(id, userId, {amount, note, date});

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                data: null,
            });
        }

        return res.json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: null,
            });
        }

        const { id } = req.params;
        const transaction = await TransactionService.deleteTransaction(id, userId);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                data: null,
            });
        }

        return res.json({
            success: true,
            message: "Transaction deleted successfully",
            data: null,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

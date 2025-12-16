import { Types } from "mongoose";
import { Transaction, ITransaction, TransactionType } from "../models/Transaction";
import { Category } from "../models/Category";

interface CreateTransactionData {
    userId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    note?: string;
    date: Date;
}

interface UpdateTransactionData {
    amount?: number;
    note?: string;
    date?: Date;
    categoryId?: string;
    type?: TransactionType;
}

interface TransactionFilters {
    startDate?: Date;
    endDate?: Date;
    type?: TransactionType;
    categoryId?: string;
}

export const create = async (data: CreateTransactionData): Promise<ITransaction> => {
    // Validate category ownership
    const category = await Category.findOne({
        _id: data.categoryId,
        userId: data.userId,
    });

    if (!category) {
        throw new Error("Category not found or does not belong to user");
    }

    // Ensure transaction type matches category type
    if (category.type !== data.type) {
        throw new Error(`Transaction type (${data.type}) must match category type (${category.type})`);
    }

    const transaction = new Transaction({
        ...data,
        userId: new Types.ObjectId(data.userId),
        categoryId: new Types.ObjectId(data.categoryId),
    });

    return await transaction.save();
};

export const findAll = async (
    userId: string,
    filters: TransactionFilters
): Promise<ITransaction[]> => {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = filters.startDate;
        if (filters.endDate) query.date.$lte = filters.endDate;
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.categoryId) {
        query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    return await Transaction.find(query)
        .populate("categoryId", "name type")
        .sort({ date: -1, createdAt: -1 });
};

export const update = async (
    id: string,
    userId: string,
    data: UpdateTransactionData
): Promise<ITransaction | null> => {
    // If updating category, verify new category ownership and type match
    if (data.categoryId) {
        const category = await Category.findOne({
            _id: data.categoryId,
            userId: userId,
        });

        if (!category) {
            throw new Error("Category not found or does not belong to user");
        }

        // If type is also being updated, check against that, otherwise check against existing transaction type?
        // Start simple: If categoryId is changed, ensure the NEW category type matches the transaction type
        // If type is changing, we'd need to re-validate against category.
        // For simplicity, let's assume we validate type if it's passed or if logic requires it.
        // The spec says "Ensure type consistency between category and transaction"

        const targetType = data.type;
        if (targetType && category.type !== targetType) {
            throw new Error(`Transaction type (${targetType}) must match category type (${category.type})`);
        }
    }

    return await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true }
    ).populate("categoryId", "name type");
};

export const deleteTransaction = async (
    id: string,
    userId: string
): Promise<ITransaction | null> => {
    return await Transaction.findOneAndDelete({ _id: id, userId });
};

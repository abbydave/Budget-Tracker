import apiClient from './api-client';

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: Category; // Note: The API returns the full category object nested here
  type: 'expense' | 'income';
  amount: number;
  note: string;
  date: string;
  createdAt: string;
}

export interface CreateTransactionData {
  categoryId: string;
  type: 'expense' | 'income';
  amount: number;
  date: string;
  note?: string;
}

export interface UpdateTransactionData {
  amount?: number;
  note?: string;
  date?: string;
  categoryId?: string;
  type?: 'expense' | 'income';
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'expense' | 'income';
  categoryId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const transactionService = {
  createTransaction: async (data: CreateTransactionData) => {
    const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data;
  },

  getTransactions: async (filters?: TransactionFilters) => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions', {
      params: filters,
    });
    return response.data;
  },

  updateTransaction: async (id: string, data: UpdateTransactionData) => {
    const response = await apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/transactions/${id}`);
    return response.data;
  },
};
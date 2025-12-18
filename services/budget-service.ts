import apiClient from './api-client';

export interface Budget {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  limit: number;
}

export interface UpsertBudgetData {
  month: string;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const budgetService = {
  upsertBudget: async (data: UpsertBudgetData) => {
    const response = await apiClient.post<ApiResponse<Budget>>('/budgets', data);
    return response.data;
  },

  getBudgetsByMonth: async (month: string) => {
    const response = await apiClient.get<ApiResponse<Budget[]>>(`/budgets/${month}`);
    return response.data;
  },

  deleteBudget: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/budgets/${id}`);
    return response.data;
  },
};
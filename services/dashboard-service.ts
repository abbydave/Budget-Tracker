import apiClient from './api-client';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryBreakdown {
  id: string; // Category ID
  total: number;
}

export interface SpendingTrend {
  id: string; // Date YYYY-MM-DD
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardService = {
  getMonthlySummary: async (month: string) => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>(`/dashboard/summary`, {
      params: { month },
    });
    return response.data;
  },

  getCategoryBreakdown: async (month: string, type: 'expense' | 'income') => {
    const response = await apiClient.get<ApiResponse<CategoryBreakdown[]>>(`/dashboard/categories`, {
      params: { month, type },
    });
    return response.data;
  },

  getSpendingTrends: async (startDate: string, endDate: string) => {
    const response = await apiClient.get<ApiResponse<SpendingTrend[]>>(`/dashboard/trends`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
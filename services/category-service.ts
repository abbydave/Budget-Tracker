import apiClient from './api-client';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'expense' | 'income';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  type: 'expense' | 'income';
}

export interface UpdateCategoryData {
  name?: string;
  type?: 'expense' | 'income';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const categoryService = {
  createCategory: async (data: CreateCategoryData) => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  getAllCategories: async (type?: 'expense' | 'income') => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: { type },
    });
    return response.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryData) => {
    const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};
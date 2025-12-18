import apiClient from './api-client';

/**
 * USER SERVICE
 * Handles all profile-related API calls.
 */

// Interface for the 'data' object in the response
export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

// Interface for the standard API response wrapper
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export const userService = {
  /**
   * Retrieves the authenticated user's profile
   * GET /profile
   */
  getProfile: async () => {
    // We use the apiClient we just built
    const response = await apiClient.get<ApiResponse<UserProfileData>>('/profile');
    
    return response.data;
  },

  /**
   * Updates user profile information
   * PUT /profile
   */
  updateProfile: async (updateData: UserProfileData) => {
    const response = await apiClient.put<ApiResponse<UserProfileData>>('/profile', updateData);
    return response.data;
  }
};
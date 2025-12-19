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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const userService = {
  /**
   * Retrieves the authenticated user's profile
   * GET /profile
   */
  async getProfile(): Promise<ApiResponse<UserProfileData>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  /**
   * Updates user profile information
   * PUT /profile
   */
  async updateProfile(
    data: UserProfileData
  ): Promise<ApiResponse<UserProfileData>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return response.json();
  },

  async logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};
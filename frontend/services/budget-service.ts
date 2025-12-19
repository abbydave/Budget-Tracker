export interface Budget {
  id: string;
  userId: string;
  month: string; // format: YYYY-MM
  limit: number;
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

export const budgetService = {
  async createOrUpdateBudget(
    month: string,
    limit: number
  ): Promise<ApiResponse<Budget>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/budgets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month, limit }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save budget");
    }

    return response.json();
  },

  async getBudgetByMonth(month: string): Promise<ApiResponse<Budget[]>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/budgets/${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch budget");
    }

    return response.json();
  },

  async deleteBudget(id: string): Promise<ApiResponse<null>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/budgets/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete budget");
    }

    return response.json();
  },
};
export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryBreakdown {
  id: string;
  total: number;
}

export interface SpendingTrend {
  id: string; // date in YYYY-MM-DD format
  total: number;
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

export const dashboardService = {
  async getMonthlySummary(month: string): Promise<ApiResponse<MonthlySummary>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`
    );
    url.searchParams.append("month", month);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch summary");
    }

    return response.json();
  },

  async getCategoryBreakdown(
    month: string,
    type: "expense" | "income"
  ): Promise<ApiResponse<CategoryBreakdown[]>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/categories`
    );
    url.searchParams.append("month", month);
    url.searchParams.append("type", type);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch category breakdown");
    }

    return response.json();
  },

  async getSpendingTrends(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<SpendingTrend[]>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/trends`
    );
    url.searchParams.append("startDate", startDate);
    url.searchParams.append("endDate", endDate);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spending trends");
    }

    return response.json();
  },
};
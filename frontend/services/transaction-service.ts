export interface Transaction {
  id: string;
  userId: string;
  category: {
    id: string;
    name: string;
    type: "expense" | "income";
  };
  type: "expense" | "income";
  amount: number;
  note: string;
  date: string;
  createdAt: string;
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

export const transactionService = {
  async createTransaction(
    categoryId: string,
    amount: number,
    date: string,
    note?: string
  ): Promise<ApiResponse<Transaction>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId,
          amount,
          date,
          note: note || "",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create transaction");
    }

    return response.json();
  },

  async getTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    type?: "expense" | "income";
    categoryId?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions`
    );

    if (filters?.startDate) {
      url.searchParams.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      url.searchParams.append("endDate", filters.endDate);
    }
    if (filters?.type) {
      url.searchParams.append("type", filters.type);
    }
    if (filters?.categoryId) {
      url.searchParams.append("categoryId", filters.categoryId);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return response.json();
  },

  async updateTransaction(
    id: string,
    data: {
      amount?: number;
      note?: string;
      date?: string;
      categoryId?: string;
    }
  ): Promise<ApiResponse<Transaction>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
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
      throw new Error(errorData.message || "Failed to update transaction");
    }

    return response.json();
  },

  async deleteTransaction(id: string): Promise<ApiResponse<null>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
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
      throw new Error(errorData.message || "Failed to delete transaction");
    }

    return response.json();
  },
};
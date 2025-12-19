export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "expense" | "income";
  createdAt: string;
  updatedAt: string;
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

export const categoryService = {
  async createCategory(
    name: string,
    type: "expense" | "income"
  ): Promise<ApiResponse<Category>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, type }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create category");
    }

    return response.json();
  },

  async getCategories(type?: "expense" | "income"): Promise<ApiResponse<Category[]>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    if (type) {
      url.searchParams.append("type", type);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },

  async updateCategory(
    id: string,
    name?: string,
    type?: "expense" | "income"
  ): Promise<ApiResponse<Category>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const body: any = {};
    if (name) body.name = name;
    if (type) body.type = type;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update category");
    }

    return response.json();
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
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
      throw new Error(errorData.message || "Failed to delete category");
    }

    return response.json();
  },
};
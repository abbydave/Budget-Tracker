"use client";

import React, { useEffect, useState } from "react";
import { categoryService, Category } from "@/services/category-service";
import CustomDropdown from "@/components/CustomDropdown";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">(
    "all"
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "expense" | "income",
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err: any) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        // Update existing category
        const response = await categoryService.updateCategory(
          editingId,
          formData.name,
          formData.type
        );

        if (response.success) {
          setCategories(
            categories.map((cat) => (cat.id === editingId ? response.data : cat))
          );
          setSuccess("Category updated successfully!");
          setEditingId(null);
        }
      } else {
        // Create new category
        const response = await categoryService.createCategory(
          formData.name,
          formData.type
        );

        if (response.success) {
          setCategories([...categories, response.data]);
          setSuccess("Category created successfully!");
        }
      }

      setFormData({
        name: "",
        type: "expense",
      });
      setShowForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      type: category.type,
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      type: "expense",
    });
    setShowForm(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !window.confirm(`Are you sure you want to delete the category "${name}"?`)
    ) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      setSuccess("Category deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete category";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (filterType === "all") return true;
    return cat.type === filterType;
  });

  const getTypeColor = (type: "expense" | "income") => {
    return type === "expense"
      ? "bg-red-500/20 text-red-400"
      : "bg-green-500/20 text-green-400";
  };

  const getTypeLabel = (type: "expense" | "income") => {
    return type === "expense" ? "Expense" : "Income";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-white text-center">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <button
          onClick={() => {
            if (editingId) {
              handleCancelEdit();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-lg transition"
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-white mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Groceries, Salary, etc."
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <CustomDropdown
              label="Category Type *"
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
              ]}
              value={formData.type}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  type: value as "expense" | "income",
                }))
              }
              placeholder="Select category type"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                ? "Update Category"
                : "Create Category"}
            </button>
          </form>
        </div>
      )}

      {/* Error/Success Messages at Top */}
      {!showForm && (error || success) && (
        <div>
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-md mb-4">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {["all", "expense", "income"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filterType === type
                ? "bg-[#7C3AED] text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full p-6 text-center text-gray-400 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
            No categories found
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg hover:border-white/20 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {category.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      category.type
                    )}`}
                  >
                    {getTypeLabel(category.type)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-500">Created:</span>{" "}
                    {formatDate(category.createdAt)}
                  </p>
                  <p>
                    <span className="text-gray-500">Updated:</span>{" "}
                    {formatDate(category.updatedAt)}
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Categories</p>
            <p className="text-2xl font-bold text-white mt-2">
              {categories.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Expense Categories</p>
            <p className="text-2xl font-bold text-red-400 mt-2">
              {categories.filter((c) => c.type === "expense").length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Income Categories</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              {categories.filter((c) => c.type === "income").length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Last Updated</p>
            <p className="text-sm font-semibold text-white mt-2">
              {formatDate(
                categories.reduce((latest, cat) =>
                  new Date(cat.updatedAt) > new Date(latest.updatedAt)
                    ? cat
                    : latest
                ).updatedAt
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

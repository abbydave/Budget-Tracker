"use client";

import React, { useEffect, useState } from "react";
import { transactionService, Transaction } from "@/services/transaction-service";
import { categoryService, Category } from "@/services/category-service";
import CustomDropdown from "@/components/CustomDropdown";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    categoryId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  // Fetch transactions and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transRes, catRes] = await Promise.all([
          transactionService.getTransactions(),
          categoryService.getCategories(),
        ]);

        if (transRes.success) {
          setTransactions(transRes.data);
        }
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (err: any) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.categoryId || !formData.amount || !formData.date) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await transactionService.createTransaction(
        formData.categoryId,
        parseFloat(formData.amount),
        new Date(formData.date).toISOString(),
        formData.note
      );

      if (response.success) {
        setTransactions([...transactions, response.data]);
        setSuccess("Transaction added successfully!");
        setFormData({
          categoryId: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          note: "",
        });
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionService.deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      setSuccess("Transaction deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    console.log(t);
    
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
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
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-lg transition"
        >
          {showForm ? "Cancel" : "Add Transaction"}
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-white mb-4">
            New Transaction
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

          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CustomDropdown
                label="Category *"
                options={[
                  ...categories
                    .filter((cat) => cat.type === "expense")
                    .map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                      group: "Expenses",
                    })),
                  ...categories
                    .filter((cat) => cat.type === "income")
                    .map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                      group: "Income",
                    })),
                ]}
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
                placeholder="Select a category"
              />

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Note
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Add a note (optional)"
                rows={3}
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Transaction"}
            </button>
          </form>
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

      {/* Transactions Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Note
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {transaction.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "expense"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {transaction.type === "expense" ? "-" : "+"}₦
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {transaction.note || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
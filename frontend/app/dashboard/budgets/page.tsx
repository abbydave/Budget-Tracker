"use client";

import React, { useEffect, useState } from "react";
import { budgetService, Budget } from "@/services/budget-service";
import { dashboardService, MonthlySummary } from "@/services/dashboard-service";

const BudgetsPage = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    limit: "",
  });

  // Get current month
  useEffect(() => {
    const now = new Date();
    const month = now.toISOString().split("T")[0].slice(0, 7);
    setCurrentMonth(month);
  }, []);

  // Fetch budget and summary
  useEffect(() => {
    if (!currentMonth) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [budgetRes, summaryRes] = await Promise.all([
          budgetService.getBudgetByMonth(currentMonth),
          dashboardService.getMonthlySummary(currentMonth),
        ]);

        if (budgetRes.success && budgetRes.data.length > 0) {
          const existingBudget = budgetRes.data[0];
          setBudget(existingBudget);
          setFormData({ limit: existingBudget.limit.toString() });
        } else {
          setBudget(null);
          setFormData({ limit: "" });
        }

        if (summaryRes.success) {
          setSummary(summaryRes.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load budget data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ limit: value });
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      setError("Please enter a valid budget limit");
      return;
    }

    setSubmitting(true);

    try {
      const response = await budgetService.createOrUpdateBudget(
        currentMonth,
        parseFloat(formData.limit)
      );

      if (response.success) {
        setBudget(response.data);
        setSuccess(
          budget
            ? "Budget updated successfully!"
            : "Budget created successfully!"
        );
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save budget");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!budget || !window.confirm("Delete this budget?")) return;

    try {
      await budgetService.deleteBudget(budget.id);
      setBudget(null);
      setFormData({ limit: "" });
      setSuccess("Budget deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete budget");
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const date = new Date(currentMonth + "-01");
    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    setCurrentMonth(date.toISOString().split("T")[0].slice(0, 7));
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="p-6 text-white text-center">
        Loading budget data...
      </div>
    );
  }

  const budgetProgress =
    budget && summary
      ? Math.min((summary.totalExpense / budget.limit) * 100, 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Monthly Budget</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMonthChange("prev")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition"
          >
            ← Previous
          </button>
          <span className="text-lg text-gray-300 min-w-[180px] text-center">
            {formatMonth(currentMonth)}
          </span>
          <button
            onClick={() => handleMonthChange("next")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition"
          >
            Next →
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg">
          {success}
        </div>
      )}

      {/* Budget Overview */}
      {budget && !isEditing && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            {/* Budget Limit */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Budget Limit</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(budget.limit)}
              </p>
            </div>

            {/* Spent */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Spent This Month</p>
              <p className="text-3xl font-bold text-red-400">
                {formatCurrency(summary?.totalExpense || 0)}
              </p>
            </div>

            {/* Remaining */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Remaining</p>
              <p
                className={`text-3xl font-bold ${
                  (budget.limit - (summary?.totalExpense || 0)) >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatCurrency(
                  Math.max(0, budget.limit - (summary?.totalExpense || 0))
                )}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Budget Progress</span>
              <span className="text-sm font-semibold text-gray-300">
                {budgetProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  budgetProgress > 100
                    ? "bg-red-500"
                    : budgetProgress > 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
            {budgetProgress > 100 && (
              <p className="text-sm text-red-400">
                ⚠️ You have exceeded your budget by{" "}
                {formatCurrency(
                  (summary?.totalExpense || 0) - budget.limit
                )}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition"
            >
              Edit Budget
            </button>
            <button
              onClick={handleDeleteBudget}
              className="px-6 py-2 border border-red-600 text-red-600 hover:bg-red-600/10 rounded-lg transition"
            >
              Delete Budget
            </button>
          </div>
        </div>
      )}

      {/* Budget Form */}
      {(isEditing || !budget) && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {budget ? "Edit Budget" : "Set Monthly Budget"}
          </h2>

          <form onSubmit={handleSaveBudget} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Budget Limit (₦)
              </label>
              <input
                type="number"
                value={formData.limit}
                onChange={handleInputChange}
                placeholder="Enter budget limit"
                step="0.01"
                min="0"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-lg"
              />
              <p className="text-xs text-gray-400 mt-2">
                Set the maximum amount you want to spend this month
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition disabled:opacity-50 font-medium"
              >
                {submitting
                  ? "Saving..."
                  : budget
                  ? "Update Budget"
                  : "Set Budget"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (budget) {
                      setFormData({ limit: budget.limit.toString() });
                    }
                  }}
                  className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Summary Info */}
      {summary && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {formatMonth(currentMonth)} Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Income</p>
              <p className="text-xl font-bold text-green-400">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <p className="text-xl font-bold text-red-400">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsPage;

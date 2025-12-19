"use client";

import React, { useEffect, useState } from "react";
import { dashboardService, MonthlySummary } from "@/services/dashboard-service";
import { budgetService, Budget } from "@/services/budget-service";

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current month in YYYY-MM format
  useEffect(() => {
    const now = new Date();
    const month = now.toISOString().split("T")[0].slice(0, 7);
    setCurrentMonth(month);
  }, []);

  // Fetch summary and budget
  useEffect(() => {
    if (!currentMonth) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, budgetRes] = await Promise.all([
          dashboardService.getMonthlySummary(currentMonth),
          budgetService.getBudgetByMonth(currentMonth),
        ]);

        if (summaryRes.success) {
          setSummary(summaryRes.data);
        }

        if (budgetRes.success && budgetRes.data.length > 0) {
          setBudget(budgetRes.data[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString().split("T")[0].slice(0, 7));
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toISOString().split("T")[0].slice(0, 7));
  };

  const budgetPercentage = budget
    ? Math.min((summary?.totalExpense || 0) / budget.limit * 100, 100)
    : 0;

  const formatCurrency = (amount: number) => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading && !summary) {
    return (
      <div className="p-6 text-white text-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Month Navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition"
          >
            ← Previous
          </button>
          <span className="text-lg text-gray-300 min-w-[180px] text-center">
            {formatMonth(currentMonth)}
          </span>
          <button
            onClick={handleNextMonth}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Income</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(summary?.totalIncome || 0)}
              </p>
            </div>
            <div className="text-4xl text-green-500 opacity-20">↓</div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(summary?.totalExpense || 0)}
              </p>
            </div>
            <div className="text-4xl text-red-500 opacity-20">↑</div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Balance</p>
              <p
                className={`text-2xl font-bold ${
                  (summary?.balance || 0) >= 0
                    ? "text-blue-400"
                    : "text-red-400"
                }`}
              >
                {formatCurrency(summary?.balance || 0)}
              </p>
            </div>
            <div className="text-4xl text-blue-500 opacity-20">⚖️</div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Monthly Budget</h2>

        {budget ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Budget Limit</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(budget.limit)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Spent This Month</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(summary?.totalExpense || 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Remaining</p>
                <p
                  className={`text-lg font-semibold ${
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
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-gray-400">
                  {budgetPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    budgetPercentage > 100
                      ? "bg-red-500"
                      : budgetPercentage > 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              No budget set for {formatMonth(currentMonth)}
            </p>
            <a
              href="/dashboard/budgets"
              className="inline-block px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition"
            >
              Set Budget
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
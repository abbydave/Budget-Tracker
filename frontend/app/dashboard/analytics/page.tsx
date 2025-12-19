"use client";

import React, { useEffect, useState } from "react";
import {
  dashboardService,
  CategoryBreakdown,
  SpendingTrend,
  MonthlySummary,
} from "@/services/dashboard-service";
import { categoryService, Category } from "@/services/category-service";

const AnalyticsPage = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>(
    []
  );
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>(
    []
  );
  const [spendingTrends, setSpendingTrends] = useState<SpendingTrend[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current month
  useEffect(() => {
    const now = new Date();
    const month = now.toISOString().split("T")[0].slice(0, 7);
    setCurrentMonth(month);
  }, []);

  // Fetch all analytics data
  useEffect(() => {
    if (!currentMonth) return;

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const startDate = new Date(currentMonth + "-01").toISOString();
        const endDate = new Date(
          new Date(currentMonth + "-01").setMonth(
            new Date(currentMonth + "-01").getMonth() + 1
          )
        ).toISOString();

        const [
          summaryRes,
          expenseRes,
          incomeRes,
          trendsRes,
          categoriesRes,
        ] = await Promise.all([
          dashboardService.getMonthlySummary(currentMonth),
          dashboardService.getCategoryBreakdown(currentMonth, "expense"),
          dashboardService.getCategoryBreakdown(currentMonth, "income"),
          dashboardService.getSpendingTrends(startDate, endDate),
          categoryService.getCategories(),
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (expenseRes.success) setExpenseBreakdown(expenseRes.data);
        if (incomeRes.success) setIncomeBreakdown(incomeRes.data);
        if (trendsRes.success) setSpendingTrends(trendsRes.data);
        if (categoriesRes.success) setCategories(categoriesRes.data);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [currentMonth]);

  const handleMonthChange = (direction: "prev" | "next") => {
    const date = new Date(currentMonth + "-01");
    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    setCurrentMonth(date.toISOString().split("T")[0].slice(0, 7));
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-white text-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Analytics & Insights</h1>
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

      {/* Summary Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Income</p>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(summary?.totalIncome || 0)}
          </p>
        </div>

        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(summary?.totalExpense || 0)}
          </p>
        </div>

        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Net Balance</p>
          <p
            className={`text-2xl font-bold ${
              (summary?.balance || 0) >= 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {formatCurrency(summary?.balance || 0)}
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Expense Breakdown</h2>

        {expenseBreakdown.length === 0 ? (
          <p className="text-gray-400">No expenses recorded this month</p>
        ) : (
          <div className="space-y-3">
            {expenseBreakdown.map((item) => {
              const percentage =
                ((item.total / (summary?.totalExpense || 1)) * 100).toFixed(1);
              return (
                <div key={item.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">
                      {getCategoryName(item.id)}
                    </span>
                    <span className="text-gray-400">
                      {formatCurrency(item.total)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income Breakdown */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Income Breakdown</h2>

        {incomeBreakdown.length === 0 ? (
          <p className="text-gray-400">No income recorded this month</p>
        ) : (
          <div className="space-y-3">
            {incomeBreakdown.map((item) => {
              const percentage =
                ((item.total / (summary?.totalIncome || 1)) * 100).toFixed(1);
              return (
                <div key={item.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">
                      {getCategoryName(item.id)}
                    </span>
                    <span className="text-gray-400">
                      {formatCurrency(item.total)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Spending Trends */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Daily Spending Trend</h2>

        {spendingTrends.length === 0 ? (
          <p className="text-gray-400">No spending data available</p>
        ) : (
          <div className="space-y-2">
            {spendingTrends.map((trend) => {
              const maxValue = Math.max(...spendingTrends.map((t) => t.total));
              const percentage = ((trend.total / maxValue) * 100).toFixed(1);
              return (
                <div key={trend.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">
                      {formatDate(trend.id)}
                    </span>
                    <span className="text-sm text-gray-300">
                      {formatCurrency(trend.total)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
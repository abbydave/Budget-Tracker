"use client";

import React, { useEffect, useState } from "react";
import {
  dashboardService,
  CategoryBreakdown,
  SpendingTrend,
  MonthlySummary,
} from "@/services/dashboard-service";
import { transactionService, Transaction } from "@/services/transaction-service";
import { categoryService, Category } from "@/services/category-service";
import { budgetService, Budget } from "@/services/budget-service";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EnhancedTrend extends SpendingTrend {
  date: string;
}

const AnalyticsPage = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>(
    []
  );
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>(
    []
  );
  const [spendingTrends, setSpendingTrends] = useState<EnhancedTrend[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const COLORS = ["#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E"];
  const INCOME_COLORS = ["#10B981", "#06B6D4", "#3B82F6", "#8B5CF6"];

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
          budgetRes,
        ] = await Promise.all([
          dashboardService.getMonthlySummary(currentMonth),
          dashboardService.getCategoryBreakdown(currentMonth, "expense"),
          dashboardService.getCategoryBreakdown(currentMonth, "income"),
          dashboardService.getSpendingTrends(startDate, endDate),
          categoryService.getCategories(),
          budgetService.getBudgetByMonth(currentMonth),
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (expenseRes.success) setExpenseBreakdown(expenseRes.data);
        if (incomeRes.success) setIncomeBreakdown(incomeRes.data);
        if (trendsRes.success) {
          const enhancedTrends = trendsRes.data.map((trend: any) => ({
            ...trend,
            date: trend.id,
          }));
          setSpendingTrends(enhancedTrends);
        }
        if (categoriesRes.success) setCategories(categoriesRes.data);
        if (budgetRes.success && budgetRes.data.length > 0) {
          setBudget(budgetRes.data[0]);
        }
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

  const exportToCSV = async () => {
    try {
      setExporting(true);
      const transRes = await transactionService.getTransactions();
      if (!transRes.success) throw new Error("Failed to fetch transactions");

      const transactions = transRes.data;

      // Create CSV content
      let csv = "Date,Category,Type,Amount,Note\n";
      transactions.forEach((tx: Transaction) => {
        const date = new Date(tx.date).toLocaleDateString();
        const category = tx.category?.name || "Unknown";
        const type = tx.type;
        const amount = tx.amount;
        const note = (tx.note || "").replace(/"/g, '""');

        csv += `${date},"${category}",${type},${amount},"${note}"\n`;
      });

      // Trigger download
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      );
      element.setAttribute("download", `transactions-${currentMonth}.csv`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err: any) {
      setError(err.message || "Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const budgetStatus =
    budget && summary
      ? {
          used: summary.totalExpense,
          limit: budget.limit,
          percentage: (summary.totalExpense / budget.limit) * 100,
          remaining: budget.limit - summary.totalExpense,
        }
      : null;

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
          <span className="text-lg text-gray-300 min-w-[180px] text-center font-medium">
            {formatMonth(currentMonth)}
          </span>
          <button
            onClick={() => handleMonthChange("next")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition"
          >
            Next →
          </button>
          <button
            onClick={exportToCSV}
            disabled={exporting}
            className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Budget Alert */}
      {budgetStatus && budgetStatus.percentage >= 90 && (
        <div
          className={`p-4 rounded-lg border ${
            budgetStatus.percentage >= 100
              ? "bg-red-500/10 border-red-500/50 text-red-400"
              : budgetStatus.percentage >= 95
              ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
              : "bg-yellow-500/10 border-yellow-500/50 text-yellow-400"
          }`}
        >
          <p className="font-semibold mb-1">
            {budgetStatus.percentage >= 100
              ? "🛑 Budget Exceeded!"
              : budgetStatus.percentage >= 95
              ? "⚠️ Critical: Almost at Budget Limit"
              : "⚠️ Warning: Approaching Budget Limit"}
          </p>
          <p className="text-sm">
            You have spent {formatCurrency(budgetStatus.used)} of{" "}
            {formatCurrency(budgetStatus.limit)} ({budgetStatus.percentage.toFixed(0)}%)
            {budgetStatus.percentage >= 100
              ? ` - You've exceeded your budget by ${formatCurrency(Math.abs(budgetStatus.remaining))}`
              : ` - ${formatCurrency(budgetStatus.remaining)} remaining`}
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Income</p>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(summary?.totalIncome || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            {incomeBreakdown.length} categories
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(summary?.totalExpense || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            {expenseBreakdown.length} categories
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Net Balance</p>
          <p
            className={`text-2xl md:text-xl lg:text-2xl font-bold break-words ${
              (summary?.balance || 0) >= 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {formatCurrency(summary?.balance || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            {(summary?.balance || 0) >= 0 ? "Surplus" : "Deficit"}
          </p>
        </div>

        {budget && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-3">Budget Status</p>
            <p className="text-2xl md:text-xl lg:text-2xl font-bold text-purple-400 break-words">
              {budgetStatus?.percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-3">
              of ₦{(budget.limit / 1000000).toFixed(1)}M
            </p>
          </div>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Expense Breakdown
          </h2>

          {expenseBreakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No expenses recorded this month
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown.map((item) => ({
                    name: getCategoryName(item.id),
                    value: item.total,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0)  * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#FFFFFF" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Income Breakdown Pie Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Income Breakdown</h2>

          {incomeBreakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No income recorded this month
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeBreakdown.map((item) => ({
                    name: getCategoryName(item.id),
                    value: item.total,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#FFFFFF" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Spending Trends Line Chart */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Daily Spending Trend</h2>

        {spendingTrends.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            No spending data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#FFFFFF" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#EF4444"
                dot={{ fill: "#EF4444", r: 4 }}
                activeDot={{ r: 6 }}
                name="Daily Spending"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Expense Categories
          </h2>

          {expenseBreakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No expenses recorded
            </p>
          ) : (
            <div className="space-y-3">
              {expenseBreakdown.map((item, index) => {
                const percentage =
                  ((item.total / (summary?.totalExpense || 1)) * 100).toFixed(
                    1
                  );
                return (
                  <div key={item.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        {getCategoryName(item.id)}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Income Categories Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Income Categories
          </h2>

          {incomeBreakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No income recorded
            </p>
          ) : (
            <div className="space-y-3">
              {incomeBreakdown.map((item, index) => {
                const percentage =
                  ((item.total / (summary?.totalIncome || 1)) * 100).toFixed(1);
                return (
                  <div key={item.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        {getCategoryName(item.id)}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            INCOME_COLORS[index % INCOME_COLORS.length],
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
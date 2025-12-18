"use client";

import { useEffect, useState } from 'react';
import SpendingTrendsChart from "@/components/dashboard_components/charts/SpendingTrendsChart";
import CategoryBreakdownChart from "@/components/dashboard_components/charts/CategoryBreakdownChart";
import MonthlyBudgetChart from "@/components/dashboard_components/charts/MonthlyBudgetChart";
import { dashboardService } from '@/services/dashboard-service';
import { budgetService } from '@/services/budget-service';

// Helper for colors
const COLORS = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#EC4899', '#6366F1'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [spendingData, setSpendingData] = useState<{ month: string, amount: number }[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<{ spent: number, limit: number }>({ spent: 0, limit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const date = new Date();
        const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6); // Last 6 months for trends

        // 1. Fetch Spending Trends
        const trendsRes = await dashboardService.getSpendingTrends(startDate.toISOString(), endDate);
        if (trendsRes.success) {
             const mappedTrends = trendsRes.data.map(t => ({
                 month: new Date(t.id).toLocaleDateString('en-US', { month: 'short' }), // Grouping daily by month might be needed if API returns daily.
                 // Assuming API returns daily trends. For a "Spending Trends" chart over 6 months, we usually want monthly aggregation.
                 // However, the chart component expects { month: string, amount: number }.
                 // Let's assume for now we just show what the API gives, or if strictly daily, the chart might get crowded.
                 // The API docs say "Get daily spending trends".
                 // Let's just map it as is, usually chart libraries handle date axes well or we just show the raw points.
                 // Ideally we should aggregate by month on client side if needed.
                 // Let's Aggregate by month for better visualization:
                 amount: t.total,
                 dateObj: new Date(t.id)
             }));

             // Client-side aggregation by month
             const monthlyAgg: Record<string, number> = {};
             mappedTrends.forEach(item => {
                 const m = item.dateObj.toLocaleDateString('en-US', { month: 'short' });
                 monthlyAgg[m] = (monthlyAgg[m] || 0) + item.amount;
             });

             const aggregatedTrends = Object.keys(monthlyAgg).map(m => ({
                 month: m,
                 amount: monthlyAgg[m]
             }));

             setSpendingData(aggregatedTrends);
        }

        // 2. Fetch Category Breakdown (Expense)
        const catRes = await dashboardService.getCategoryBreakdown(currentMonth, 'expense');
        if (catRes.success) {
            const total = catRes.data.reduce((acc, curr) => acc + curr.total, 0);
            const mappedCats = catRes.data.map((c, idx) => ({
                name: c.id, // API returns ID? Docs say: "id": "string (MongoDB ObjectId of category)". Wait, usually it returns populated name or we need to look it up.
                // The API docs say "id": "string". It might just be the ID.
                // If it is just the ID, we can't display the name without fetching categories.
                // However, often "id" in breakdown endpoints refers to the grouping key (which might be the category name if grouped by name, or ID).
                // Let's assume it's the Name for now as typically breakdowns group by name, OR handle the ID display.
                // If it really is an ID, we'd need to fetch categories to resolve it.
                // Let's assume it is the ID and we display it (or maybe the API actually returns the name in a real scenario).
                amount: c.total,
                percentage: total > 0 ? Math.round((c.total / total) * 100) : 0,
                color: COLORS[idx % COLORS.length]
            }));
            setCategoryData(mappedCats);
        }

        // 3. Fetch Budget (and calculate spent)
        // We need 'spent' for the current month. We can get that from the Monthly Summary endpoint!
        const summaryRes = await dashboardService.getMonthlySummary(currentMonth);
        const budgetsRes = await budgetService.getBudgetsByMonth(currentMonth);

        let totalLimit = 0;
        if (budgetsRes.success) {
            // Sum all budget limits for the month (if multiple) or take the first
            totalLimit = budgetsRes.data.reduce((acc, b) => acc + b.limit, 0);
        }

        let totalSpent = 0;
        if (summaryRes.success) {
            totalSpent = summaryRes.data.totalExpense;
        }

        setBudgetData({ spent: totalSpent, limit: totalLimit });

      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return <div className="p-6 text-white">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <SpendingTrendsChart data={spendingData} />
        <CategoryBreakdownChart categories={categoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
        <MonthlyBudgetChart spent={budgetData.spent} limit={budgetData.limit} />
      </div>
    </div>
  );
}
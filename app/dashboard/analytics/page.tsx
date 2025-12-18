"use client";

import SpendingTrendsChart from "@/components/dashboard_components/charts/SpendingTrendsChart";
import CategoryBreakdownChart from "@/components/dashboard_components/charts/CategoryBreakdownChart";
import MonthlyBudgetChart from "@/components/dashboard_components/charts/MonthlyBudgetChart";

// Dummy Data
const spendingData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
];

const categoryData = [
  { name: 'Food & Dining', amount: 25000, percentage: 35, color: '#F87171' }, // red
  { name: 'Transportation', amount: 15000, percentage: 20, color: '#60A5FA' }, // blue
  { name: 'Utilities', amount: 10000, percentage: 15, color: '#34D399' }, // green
  { name: 'Entertainment', amount: 12000, percentage: 18, color: '#FBBF24' }, // yellow
  { name: 'Others', amount: 5000, percentage: 12, color: '#A78BFA' }, // purple
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <SpendingTrendsChart data={spendingData} />
        <CategoryBreakdownChart categories={categoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
        <MonthlyBudgetChart spent={145000} limit={200000} />
      </div>
    </div>
  );
}
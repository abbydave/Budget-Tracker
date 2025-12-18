"use client";

import { useEffect, useState } from 'react';
import StatCard from "@/components/dashboard_components/StatCard";
import SpendingTrendsChart from "@/components/dashboard_components/charts/SpendingTrendsChart";
import TransactionList from "@/components/dashboard_components/TransactionList";
import { dashboardService } from '@/services/dashboard-service';
import { transactionService } from '@/services/transaction-service';

// Helper to get current month in YYYY-MM format
const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0
  });
  const [spendingTrends, setSpendingTrends] = useState<{ month: string, amount: number }[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentMonth = getCurrentMonth();

        // 1. Fetch Monthly Summary
        const summaryResponse = await dashboardService.getMonthlySummary(currentMonth);
        if (summaryResponse.success) {
            setStats({
                balance: summaryResponse.data.balance,
                income: summaryResponse.data.totalIncome,
                expenses: summaryResponse.data.totalExpense
            });
        }

        // 2. Fetch Recent Transactions
        const transactionsResponse = await transactionService.getTransactions();
        if (transactionsResponse.success) {
             // Map API response to Component format
             const mappedTransactions = transactionsResponse.data.slice(0, 5).map(t => ({
                id: t.id,
                name: t.note || 'Transaction', // The API doesn't have a 'name' field, using 'note'
                category: t.categoryId.name,
                amount: t.amount,
                type: t.type,
                date: t.date
             }));
             setRecentTransactions(mappedTransactions);
        }

        // 3. Fetch Spending Trends (Last 30 days for example)
        // Calculating dates
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const trendsResponse = await dashboardService.getSpendingTrends(startDate.toISOString(), endDate);
        if (trendsResponse.success) {
             // Map API response to Component format
             const mappedTrends = trendsResponse.data.map(t => ({
                 month: new Date(t.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                 amount: t.total
             }));
             setSpendingTrends(mappedTrends);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  return (
    <section className="space-y-6">
      <StatCard {...stats} />
      <SpendingTrendsChart data={spendingTrends} />
      <TransactionList transactions={recentTransactions} />
    </section>
  );
}
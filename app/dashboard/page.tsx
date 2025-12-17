import StatCard from "@/components/dashboard_components/StatCard";
import SpendingTrendsChart from "@/components/dashboard_components/charts/SpendingTrendsChart";
import TransactionList from "@/components/dashboard_components/TransactionList";

// Dummy Data
const spendingData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 900 },
  { month: 'Mar', amount: 1500 },
  { month: 'Apr', amount: 800 },
  { month: 'May', amount: 1100 },
  { month: 'Jun', amount: 1700 },
];

const transactions = [
  { id: '1', name: 'Whole Foods Market', category: 'Groceries', amount: 124.50, type: 'expense' as const, date: '2023-10-25' },
  { id: '2', name: 'Starbucks Coffee', category: 'Coffee', amount: 5.75, type: 'expense' as const, date: '2023-10-24' },
  { id: '3', name: 'Freelance Payment', category: 'Income', amount: 2500.00, type: 'income' as const, date: '2023-10-23' },
  { id: '4', name: 'Uber Ride', category: 'Transport', amount: 18.20, type: 'expense' as const, date: '2023-10-22' },
];

const stats = {
  balance: 12450.00,
  income: 3200.00,
  expenses: 1450.00
};

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <StatCard {...stats} />
      <SpendingTrendsChart data={spendingData} />
      <TransactionList transactions={transactions} />
    </section>
  );
}

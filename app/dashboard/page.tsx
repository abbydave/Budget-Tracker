import StatCard from "@/components/dashboard_components/StatCard";
import SpendingTrendsChart from "@/components/dashboard_components/charts/SpendingTrendsChart";
import TransactionList from "@/components/dashboard_components/TransactionList";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <StatCard />
      <SpendingTrendsChart />
      <TransactionList />
    </section>
  );
}

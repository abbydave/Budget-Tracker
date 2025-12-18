import BudgetHeader from "@/components/Budject_components/BudgetHeader";
import BudgetSummary from "@/components/Budject_components/BudgetSummary";
import BudgetCategoryCard from "@/components/Budject_components/BudgetCategoryCard";

export default function BudgetsPage() {
  return (
    <div className="space-y-10">
      <BudgetHeader />
      <BudgetSummary />

      <div className="grid grid-cols-3 gap-6">
        <BudgetCategoryCard
          title="Housing"
          spent={1800}
          limit={2000}
          barColor="bg-orange-500"
        />
        <BudgetCategoryCard
          title="Food"
          spent={350}
          limit={600}
          barColor="bg-green-500"
        />
        <BudgetCategoryCard
          title="Transport"
          spent={120}
          limit={300}
          barColor="bg-blue-500"
        />
      </div>
    </div>
  );
}

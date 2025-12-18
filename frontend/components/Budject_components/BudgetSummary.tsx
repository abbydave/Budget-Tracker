import BudgetDonut from "./BudgetDonut";
import BudgetStat from "./BudgetStat";

export default function BudgetSummary() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Monthly Budget */}
      <div className="col-span-2 bg-[#111A2B] rounded-xl p-6 flex items-center gap-8">
        <BudgetDonut percent={76} />

        <div>
          <h3 className="font-semibold mb-2">Monthly Budget</h3>
          <p className="text-sm text-gray-400">Spent: $2,720</p>
          <p className="text-sm text-gray-400">Limit: $3,600</p>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-[#111A2B] rounded-xl p-6 space-y-4">
        <BudgetStat label="Total Budgeted" value="$3,600" />
        <BudgetStat
          label="Total Spent"
          value="$2,720"
          color="text-yellow-400"
        />
        <BudgetStat label="Remaining" value="$880" color="text-green-400" />
      </div>
    </div>
  );
}

interface BudgetCategoryCardProps {
  title: string;
  spent: number;
  limit: number;
  barColor: string;
}

export default function BudgetCategoryCard({
  title,
  spent,
  limit,
  barColor,
}: BudgetCategoryCardProps) {
  const percent = Math.min((spent / limit) * 100, 100);

  return (
    <div className="bg-[#111A2B] rounded-xl p-6">
      <h4 className="font-semibold mb-4">{title}</h4>

      <div className="mb-3 text-lg font-bold">
        ${spent} <span className="text-sm text-gray-400">of ${limit}</span>
      </div>

      <div className="w-full h-2 bg-[#1B2436] rounded-full overflow-hidden mb-3">
        <div
          className={`${barColor} h-full`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm text-gray-400">Remaining: ${limit - spent}</p>
    </div>
  );
}

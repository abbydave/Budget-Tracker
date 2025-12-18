interface BudgetDonutProps {
  percent: number;
}

export default function BudgetDonut({ percent }: BudgetDonutProps) {
  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full border-10 border-indigo-600 border-t-transparent rotate-270" />
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
        {percent}%
      </div>
    </div>
  );
}

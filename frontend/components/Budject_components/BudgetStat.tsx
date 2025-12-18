interface BudgetStatProps {
  label: string;
  value: string;
  color?: string;
}

export default function BudgetStat({ label, value, color }: BudgetStatProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className={`font-semibold ${color ?? ""}`}>{value}</span>
    </div>
  );
}

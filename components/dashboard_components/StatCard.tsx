// components/dashboard_components/StatCard.tsx

interface StatCardProps {
  balance?: number; // Made optional to prevent strict type errors
  income?: number;
  expenses?: number;
}

export default function StatCard({ balance, income, expenses }: StatCardProps) {
  // Defensive coding: If value is undefined, use 0
  const safeBalance = balance ?? 0;
  const safeIncome = income ?? 0;
  const safeExpenses = expenses ?? 0;

  return (
    <div className="bg-glass p-8 rounded-3xl border border-gray-800 relative overflow-hidden">
      {/* Background Gradient Blob effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-gray-400 font-medium mb-1">Welcome back, John!</h3>
        <p className="text-sm text-gray-500 mb-6">Here is your financial summary</p>

        <div className="mb-8">
          <span className="text-gray-400 text-sm block mb-2">Total Balance</span>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            ₦{safeBalance.toLocaleString()} 
          </h2>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#111827] px-4 py-3 rounded-xl border border-gray-800 flex-1">
            <p className="text-xs text-gray-500 mb-1">Total Income</p>
            <p className="text-green-400 font-semibold">+₦{safeIncome.toLocaleString()}</p>
          </div>
          <div className="bg-[#111827] px-4 py-3 rounded-xl border border-gray-800 flex-1">
            <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
            <p className="text-red-400 font-semibold">-₦{safeExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
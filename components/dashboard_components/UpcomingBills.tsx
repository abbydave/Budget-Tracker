import { Zap } from 'lucide-react';

interface Bill {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
}

export default function UpcomingBills({ bills }: { bills: Bill[] }) {
  return (
    <div className="bg-glass p-6 rounded-3xl border border-gray-800 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Upcoming Bills</h3>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{bill.name}</p>
                <p className="text-xs text-gray-500">Due {bill.dueDate}</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-white">
              ₦{bill.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
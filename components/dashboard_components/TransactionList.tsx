import { ShoppingBag, Coffee, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

// Dummy data 
const getIcon = (name: string) => {
  if (name.includes('Grocery')) return <ShoppingBag className="w-5 h-5 text-purple-400" />;
  if (name.includes('Coffee') || name.includes('Food')) return <Coffee className="w-5 h-5 text-orange-400" />;
  return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
};

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-glass p-6 rounded-3xl border border-gray-800 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#111827] border border-gray-700 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                {getIcon(t.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.category}</p>
              </div>
            </div>
            <div className={`text-sm font-semibold ₦{t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
              {t.type === 'income' ? '+' : ''}₦{t.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
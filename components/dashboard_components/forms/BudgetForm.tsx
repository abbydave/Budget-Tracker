"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';

interface BudgetFormProps {
  categories: string[]; 
  onSetBudget: (category: string, limit: number) => void;
}

export default function BudgetForm({ categories, onSetBudget }: BudgetFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && amount) {
      onSetBudget(selectedCategory, parseFloat(amount));
      setAmount(''); 
    }
  };

  return (
    <div className="bg-[#1F2937] p-6 rounded-3xl border border-gray-800">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Set Monthly Budget</h3>
        <p className="text-sm text-gray-400">Define limits for your spending categories.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Budget Limit ($)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={!amount}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Set Budget
        </button>
      </form>
    </div>
  );
}
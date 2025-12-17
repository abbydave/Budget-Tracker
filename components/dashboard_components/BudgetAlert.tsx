import { AlertTriangle } from 'lucide-react';

interface BudgetAlertProps {
  category: string;
  spent: number;
  limit: number;
}

export default function BudgetAlert({ category, spent, limit }: BudgetAlertProps) {
  const percentage = (spent / limit) * 100;

  if (percentage < 80) return null;

  const isOverBudget = percentage >= 100;

  return (
    <div className={`mb-6 rounded-xl p-4 flex items-start gap-3 border ₦{
      isOverBudget 
        ? 'bg-red-500/10 border-red-500/50 text-red-200' 
        : 'bg-orange-500/10 border-orange-500/50 text-orange-200'
    }`}>
      <AlertTriangle className={`w-5 h-5 ₦{isOverBudget ? 'text-red-500' : 'text-orange-500'} shrink-0`} />
      <div className="flex-1">
        <h4 className="font-semibold text-sm">
          {isOverBudget ? 'Budget Limit Exceeded' : 'Approaching Budget Limit'}
        </h4>
        <p className="text-xs opacity-90 mt-1">
          You have spent <strong>₦{spent}</strong> of your <strong>₦{limit}</strong> {category} budget ({percentage.toFixed(0)}%).
        </p>
      </div>
    </div>
  );
}
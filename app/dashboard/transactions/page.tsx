"use client";

import { useState } from 'react';
import TransactionList from "@/components/dashboard_components/TransactionList";
import AddTransactionModal from "@/components/dashboard_components/forms/AddTransaction";

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface TransactionData {
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  description: string;
}

// Initial dummy data
const initialTransactions: Transaction[] = [
  { id: '1', name: 'Whole Foods Market', category: 'Groceries', amount: 124.50, type: 'expense', date: '2023-10-25' },
  { id: '2', name: 'Starbucks Coffee', category: 'Coffee', amount: 5.75, type: 'expense', date: '2023-10-24' },
  { id: '3', name: 'Freelance Payment', category: 'Income', amount: 2500.00, type: 'income', date: '2023-10-23' },
  { id: '4', name: 'Uber Ride', category: 'Transport', amount: 18.20, type: 'expense', date: '2023-10-22' },
  { id: '5', name: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, type: 'expense', date: '2023-10-21' },
];

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleSave = (data: TransactionData) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.description || 'New Transaction',
      category: data.category,
      amount: data.amount,
      type: data.type,
      date: data.date,
    };
    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Transaction
        </button>
      </div>

      <TransactionList transactions={transactions} />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
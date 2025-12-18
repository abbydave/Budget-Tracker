"use client";

import { useEffect, useState } from 'react';
import TransactionList from "@/components/dashboard_components/TransactionList";
import AddTransactionModal from "@/components/dashboard_components/forms/AddTransaction";
import { transactionService } from '@/services/transaction-service';
import { categoryService, Category } from '@/services/category-service';

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
  category: string; // This is the Category ID when saving to API, or name for display? The form returns a string.
  description: string;
}

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch Transactions and Categories on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [transResponse, catsResponse] = await Promise.all([
          transactionService.getTransactions(),
          categoryService.getAllCategories()
        ]);

        if (transResponse.success) {
            const mapped = transResponse.data.map(t => ({
                id: t.id,
                name: t.note || 'Transaction',
                category: t.categoryId.name,
                amount: t.amount,
                type: t.type,
                date: t.date
            }));
            setTransactions(mapped);
        }

        if (catsResponse.success) {
            setCategories(catsResponse.data);
        }

      } catch (error) {
        console.error("Failed to fetch transactions page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSave = async (data: TransactionData) => {
    try {
        // Find category ID based on name if necessary, OR assuming the modal returns the Category ID.
        // The AddTransactionModal we built currently returns a 'category' string (name) from a hardcoded list.
        // We need to update the Modal to accept dynamic categories or handle the mapping here.
        // For now, let's assume we map the category name to an ID if possible, or create a category on the fly?
        // Actually, the best approach is to pass the fetched categories to the Modal.
        // But since I can't easily modify the Modal props structure without breaking other things (potentially),
        // let's try to match the name.

        const categoryMatch = categories.find(c => c.name === data.category && c.type === data.type);
        let categoryId = categoryMatch?.id;

        // If no category found (e.g. user selected "Food" but it doesn't exist in DB), we might need to create it?
        // Or simply fail. For this integration, let's try to be robust.
        if (!categoryId) {
             // Try to create it first
             try {
                const newCat = await categoryService.createCategory({ name: data.category, type: data.type });
                if (newCat.success) categoryId = newCat.data.id;
             } catch (err) {
                console.error("Failed to auto-create category", err);
                alert("Please select a valid category.");
                return;
             }
        }

        if (!categoryId) return;

        const response = await transactionService.createTransaction({
            amount: data.amount,
            date: data.date,
            type: data.type,
            categoryId: categoryId,
            note: data.description
        });

        if (response.success) {
            // Add to state
            const newT = response.data;
            setTransactions(prev => [{
                id: newT.id,
                name: newT.note || 'New Transaction',
                category: newT.categoryId.name || data.category, // API returns populated category object
                amount: newT.amount,
                type: newT.type,
                date: newT.date
            }, ...prev]);
            setIsModalOpen(false);
        }
    } catch (error) {
        console.error("Failed to save transaction:", error);
        alert("Failed to save transaction. Please try again.");
    }
  };

  if (loading) {
      return <div className="p-6 text-white">Loading transactions...</div>;
  }

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
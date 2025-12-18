"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function BudgetHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <ChevronLeft />
        <span className="font-semibold">December 2025</span>
        <ChevronRight />
      </div>

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-[#1B2436] rounded-lg">
          All Budgets
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg">
          <Plus size={16} />
          New Budget
        </button>
      </div>
    </div>
  );
}

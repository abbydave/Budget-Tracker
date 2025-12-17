"use client";
import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  onDateChange: (start: string, end: string) => void;
}

export default function DateRangePicker({ onDateChange }: DateRangePickerProps) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const handleApply = () => {
    onDateChange(startDate, endDate);
  };

  return (
    <div className="flex items-center gap-2 bg-[#1F2937] p-1 rounded-xl border border-gray-800">
      <div className="flex items-center gap-2 px-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-transparent text-xs text-white focus:outline-none w-24 [color-scheme:dark]"
        />
        
        <span className="text-gray-500 text-xs">to</span>
        
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-transparent text-xs text-white focus:outline-none w-24 [color-scheme:dark]"
        />
      </div>

      <button
        onClick={handleApply}
        className="bg-[#111827] hover:bg-primary text-white text-xs px-3 py-1.5 rounded-lg transition-colors border border-gray-700"
      >
        Filter
      </button>
    </div>
  );
}
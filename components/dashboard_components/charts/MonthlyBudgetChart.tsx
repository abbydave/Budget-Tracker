"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyBudgetProps {
  spent: number;
  limit: number;
}

export default function MonthlyBudgetChart({ spent, limit }: MonthlyBudgetProps) {
  const percentage = Math.round((spent / limit) * 100);
  const remaining = limit - spent;

  const data = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [spent, remaining > 0 ? remaining : 0],
        backgroundColor: [
          '#7C3AED', 
          '#374151', 
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '75%', 
    plugins: {
      legend: { display: false }, 
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-[#1F2937] p-6 rounded-3xl border border-gray-800 h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Monthly Budget</h3>
        <button className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{percentage}%</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-xs text-gray-400">Spent</span>
            </div>
            <p className="text-white font-semibold ml-4">${spent.toLocaleString()}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
              <span className="text-xs text-gray-400">Limit</span>
            </div>
            <p className="text-white font-semibold ml-4">${limit.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
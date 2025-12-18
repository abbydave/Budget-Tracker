"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export default function CategoryBreakdownChart({ categories }: { categories: CategoryData[] }) {
  
  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.amount),
        backgroundColor: categories.map(c => c.color),
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    cutout: '65%',
    plugins: {
      legend: { display: false }, // Custom legend
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed !== null) {
                label += '₦' + context.parsed.toLocaleString();
            }
            return label;
          }
        }
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-[#1F2937] p-6 rounded-3xl border border-gray-800 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Category Breakdown</h3>
        <button className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Custom Legend (Left Side) */}
        <div className="flex-1 space-y-3">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: cat.color }}
                ></span>
                <span className="text-xs text-gray-400">{cat.name}</span>
              </div>
              <span className="text-xs font-semibold text-white">{cat.percentage}%</span>
            </div>
          ))}
        </div>

        {/* Chart (Right Side) */}
        <div className="w-32 h-32 relative">
           <Doughnut data={data} options={options} />
           {/* Center Icon or Empty */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-2 h-2 bg-gray-700 rounded-full opacity-20"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
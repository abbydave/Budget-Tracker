"use client";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ScriptableContext
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface SpendingData {
  month: string;
  amount: number;
}

export default function SpendingTrendsChart({ data }: { data: SpendingData[] }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Total Spent',
        data: data.map((d) => d.amount),
        borderColor: '#22D3EE', 
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.5)'); 
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');   
          return gradient;
        },
        fill: true,
        tension: 0.4, 
        pointBackgroundColor: '#111827',
        pointBorderColor: '#22D3EE',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#fff',
        bodyColor: '#9CA3AF',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += '₦' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#9CA3AF', font: { size: 10 } },
      },
      y: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { display: false }, 
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-[#1F2937] p-6 rounded-3xl border border-gray-800 h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Spending Trends</h3>
        <div className="text-xs text-gray-400">Last 6 months</div>
      </div>
      <div className="h-48 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
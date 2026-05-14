import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { Category } from '../types';

const COLORS = {
  food: '#F43F5E',
  transport: '#0EA5E9',
  data: '#8B5CF6',
  fun: '#F59E0B',
  other: '#10B981'
};

interface SpendingPieChartProps {
  data: { name: string; value: number }[];
}

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  return (
    <div className="h-64 w-full min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as Category] || '#ccc'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DailySpendingBarChartProps {
  data: { date: string; amount: number }[];
}

export function DailySpendingBarChart({ data }: DailySpendingBarChartProps) {
  return (
    <div className="h-64 w-full min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Bar dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

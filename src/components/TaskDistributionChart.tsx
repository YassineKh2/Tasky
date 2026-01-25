import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface TaskDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#2C2416', '#6B5D4F', '#8B7355', '#C0B09C', '#D4C4B0', '#E8DCC4'];

export function TaskDistributionChart({ data }: TaskDistributionChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-[#E8DCC4] shadow-sm h-80">
      <h3 className="font-serif-text text-lg font-bold text-[#8B7355] mb-4 uppercase tracking-wider">
        Task Distribution
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFBF5', 
              borderColor: '#E8DCC4',
              borderRadius: '8px',
              fontFamily: 'serif',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ fontFamily: 'serif', fontSize: '12px', color: '#8B7355' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

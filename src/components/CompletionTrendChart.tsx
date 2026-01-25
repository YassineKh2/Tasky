import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface CompletionTrendChartProps {
  data: { date: string; completed: number; missed: number }[];
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-[#E8DCC4] shadow-sm h-80">
      <h3 className="font-serif-text text-lg font-bold text-[#8B7355] mb-4 uppercase tracking-wider">
        Weekly Trends
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2C2416" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2C2416" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMissed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#8B7355', fontSize: 12, fontFamily: 'serif' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fill: '#8B7355', fontSize: 12, fontFamily: 'serif' }}
            tickLine={false}
            axisLine={false}
          />
          <CartesianGrid vertical={false} stroke="#E8DCC4" strokeDasharray="3 3" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFBF5', 
              borderColor: '#E8DCC4',
              borderRadius: '8px',
              fontFamily: 'serif',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="completed" 
            stroke="#2C2416" 
            fillOpacity={1} 
            fill="url(#colorCompleted)" 
            name="Tasks Completed"
          />
          <Area 
            type="monotone" 
            dataKey="missed" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorMissed)" 
            name="Tasks Missed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompletionTrendChartProps {
  data: { date: string; completed: number; missed: number }[];
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  // Show 7 days at a time. Default to showing the last 7 days of the dataset.
  const DAYS_TO_SHOW = 7;
  const [startIndex, setStartIndex] = useState(Math.max(0, data.length - DAYS_TO_SHOW));

  // Update startIndex when data changes (e.g. if new data arrives)
  useEffect(() => {
    setStartIndex(Math.max(0, data.length - DAYS_TO_SHOW));
  }, [data.length]); // Depend on length to reset to end

  const visibleData = data.slice(startIndex, startIndex + DAYS_TO_SHOW);
  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + DAYS_TO_SHOW < data.length;

  const handlePrev = () => {
    if (canGoBack) {
      setStartIndex(Math.max(0, startIndex - DAYS_TO_SHOW)); // Jump by week
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setStartIndex(Math.min(data.length - DAYS_TO_SHOW, startIndex + DAYS_TO_SHOW));
    }
  };

  // derived date range string
  const startStr = visibleData[0]?.date || "";
  const endStr = visibleData[visibleData.length - 1]?.date || "";

  return (
    <div className="bg-white p-6 rounded-lg border border-[#E8DCC4] shadow-sm h-80 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif-text text-lg font-bold text-[#8B7355] uppercase tracking-wider">
          Weekly Trends
        </h3>
        
        <div className="flex items-center gap-2 bg-[#FFFBF5] rounded-lg border border-[#E8DCC4] px-1 py-1">
          <button
            onClick={handlePrev}
            disabled={!canGoBack}
            className={`p-1 rounded-md transition-colors ${!canGoBack ? "text-[#E8DCC4] cursor-not-allowed" : "text-[#8B7355] hover:bg-[#E8DCC4]/30 hover:text-[#2C2416]"}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="font-serif-text text-xs text-[#8B7355] min-w-[100px] text-center font-medium">
            {startStr} - {endStr}
          </span>

          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className={`p-1 rounded-md transition-colors ${!canGoForward ? "text-[#E8DCC4] cursor-not-allowed" : "text-[#8B7355] hover:bg-[#E8DCC4]/30 hover:text-[#2C2416]"}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visibleData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
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
              interval={0} // Show all ticks for the week
            />
            <YAxis 
              tick={{ fill: '#8B7355', fontSize: 12, fontFamily: 'serif' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
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
              animationDuration={500}
            />
            <Area 
              type="monotone" 
              dataKey="missed" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorMissed)" 
              name="Tasks Missed"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

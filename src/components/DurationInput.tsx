import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
interface DurationInputProps {
  duration: number; // minutes
  onChange: (duration: number) => void;
  isBaseline?: boolean;
  className?: string;
}
export function DurationInput({
  duration,
  onChange,
  isBaseline = false,
  className = "",
}: DurationInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(duration.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setValue(duration.toString());
  }, [duration]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleBlur = () => {
    setIsEditing(false);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      onChange(num);
    } else {
      setValue(duration.toString());
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };
  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Clock className="w-3 h-3 text-[#8B7355]" />
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-12 bg-transparent border-b border-[#2C2416] font-handwriting text-sm text-[#2C2416] outline-none p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="font-handwriting text-xs text-[#8B7355]">min</span>
      </div>
    );
  }
  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`
        flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#E8DCC4]/30 transition-colors group
        ${className}
      `}
      title={isBaseline ? "Baseline duration" : "Click to edit duration"}
    >
      <Clock
        className={`w-3 h-3 ${isBaseline ? "text-[#8B7355]/70" : "text-[#8B7355]"}`}
      />
      <span
        className={`
        font-handwriting text-sm
        ${isBaseline ? "text-[#8B7355]/70 italic" : "text-[#6B5D4F] font-medium"}
        group-hover:text-[#2C2416]
      `}
      >
        {formatDuration(duration)}
      </span>
    </button>
  );
}

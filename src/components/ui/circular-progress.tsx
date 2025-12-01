import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  minValue?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValueLabel?: boolean;
  valueLabel?: React.ReactNode;
}

export function CircularProgress({
  value,
  maxValue = 100,
  minValue = 0,
  size = 112,
  strokeWidth = 4,
  className,
  showValueLabel = true,
  valueLabel,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.max(minValue, Math.min(maxValue, value));
  const percentage = ((normalizedValue - minValue) / (maxValue - minValue)) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-indigo-600/10"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-indigo-600 transition-all duration-300"
        />
      </svg>
      {/* Value label */}
      {showValueLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          {valueLabel || (
            <span className="text-3xl font-semibold text-indigo-600">
              {Math.round(normalizedValue)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
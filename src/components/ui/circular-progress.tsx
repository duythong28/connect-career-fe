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
  colorClassName?: string;
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
  colorClassName = "text-indigo-600",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.max(minValue, Math.min(maxValue, value));
  const percentage =
    ((normalizedValue - minValue) / (maxValue - minValue)) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={cn("opacity-10", colorClassName)}
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
          className={cn("transition-all duration-300", colorClassName)}
        />
      </svg>
      {/* Value label */}
      {showValueLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          {valueLabel || (
            <span className={cn("text-3xl font-semibold", colorClassName)}>
              {Math.round(normalizedValue)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

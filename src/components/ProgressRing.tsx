import "./ProgressRing.css";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  color?: "primary" | "success" | "warning";
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  label,
  color = "primary",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const gradientId = `progress-gradient-${color}`;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {color === "primary" && (
              <>
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </>
            )}
            {color === "success" && (
              <>
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </>
            )}
            {color === "warning" && (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          className="progress-ring__bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          className="progress-ring__circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>

      {showValue && (
        <div className="progress-ring__content">
          <span className="progress-ring__value">{Math.round(progress)}%</span>
          {label && <span className="progress-ring__label">{label}</span>}
        </div>
      )}
    </div>
  );
}

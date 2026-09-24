interface ProgressBarProps {
  percent: number;
  size?: "sm" | "lg";
}

export default function ProgressBar({ percent, size = "sm" }: ProgressBarProps) {
  const height = size === "lg" ? "h-5" : "h-3";

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full ${height} bg-cyber-bg border-2 border-cyber-border overflow-hidden`}
    >
      <div
        className="h-full bg-cyber-accent transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

import ProgressBar from "./ProgressBar";

interface OverallProgressProps {
  checked: number;
  total: number;
  percent: number;
}

export default function OverallProgress({
  checked,
  total,
  percent,
}: OverallProgressProps) {
  return (
    <section className="bg-cyber-surface border-2 border-cyber-border shadow-neo-lime mb-8">
      <div className="bg-cyber-bg border-b-2 border-cyber-border px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="w-3 h-3 bg-red-500 border border-black" />
            <span className="w-3 h-3 bg-yellow-500 border border-black" />
            <span className="w-3 h-3 bg-green-500 border border-black" />
          </div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-cyber-accent">
            Overall_Progress
          </h2>
        </div>
        <span className="font-mono text-xs bg-cyber-border px-2 py-0.5 text-cyber-text">
          {checked}/{total}
        </span>
      </div>

      <div className="p-4">
        <p className="font-mono text-5xl font-black text-white leading-none mb-4">
          {percent}
          <span className="text-cyber-accent">%</span>
        </p>
        <ProgressBar percent={percent} size="lg" />
        <p className="font-mono text-xs text-cyber-muted mt-3">
          {checked} dari {total} item selesai
        </p>
      </div>
    </section>
  );
}

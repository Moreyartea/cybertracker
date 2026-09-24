"use client";

import { Stage, ProgressMap } from "@/types/checklist";
import { getStageProgress } from "@/lib/progress";
import ProgressBar from "./ProgressBar";
import ChecklistItem from "./ChecklistItem";

export type Filter = "all" | "todo" | "konsep" | "praktik";

interface StageCardProps {
  stage: Stage;
  progress: ProgressMap;
  open: boolean;
  filter: Filter;
  onToggleOpen: (stageId: string) => void;
  onToggleItem: (id: string) => void;
}

export default function StageCard({
  stage,
  progress,
  open,
  filter,
  onToggleOpen,
  onToggleItem,
}: StageCardProps) {
  const { checked, total, percent } = getStageProgress(stage, progress);
  const isComplete = percent === 100;

  const visible = stage.items.filter((i) =>
    filter === "all" ? true : filter === "todo" ? !progress[i.id] : i.type === filter
  );
  if (visible.length === 0) return null;

  // saat filter aktif, item langsung tampil tanpa perlu buka tiap stage
  const expanded = filter !== "all" || open;

  return (
    <div
      className={`scroll-mt-24 bg-cyber-surface border-2 transition-colors ${
        expanded ? "border-cyber-accent shadow-neo-slate" : "border-cyber-border"
      }`}
    >
      <button
        onClick={() => onToggleOpen(stage.id)}
        aria-expanded={expanded}
        className="w-full flex items-center gap-4 p-4 text-left active:bg-cyber-border/30"
      >
        <span
          className={`shrink-0 w-10 h-10 flex items-center justify-center font-mono text-sm font-black border-2 ${
            isComplete
              ? "bg-cyber-accent border-cyber-accent text-black"
              : "border-cyber-border text-cyber-muted"
          }`}
        >
          {isComplete ? "✓" : String(stage.number).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold tracking-tight leading-snug text-cyber-text">
              {stage.title}
            </h3>
            <span
              className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${
                isComplete ? "text-cyber-accent" : "text-cyber-muted"
              }`}
            >
              {checked}/{total}
            </span>
          </div>
          {stage.description && (
            <p className="text-xs text-cyber-muted mt-1 leading-relaxed">
              {stage.description}
            </p>
          )}
          <div className="mt-3">
            <ProgressBar percent={percent} />
          </div>
        </div>

        <span
          aria-hidden
          className={`shrink-0 text-cyber-accent transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="border-t-2 border-cyber-border px-3 pb-2 pt-1">
          {visible.map((item) => (
            <ChecklistItem
              key={item.id}
              domId={`item-${item.id}`}
              item={item}
              checked={!!progress[item.id]}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

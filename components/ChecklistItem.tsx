import { ChecklistItem as ChecklistItemType } from "@/types/checklist";

interface ChecklistItemProps {
  item: ChecklistItemType;
  checked: boolean;
  onToggle: (id: string) => void;
  domId?: string;
}

export default function ChecklistItem({
  item,
  checked,
  onToggle,
  domId,
}: ChecklistItemProps) {
  return (
    <label id={domId} className="flex scroll-mt-32 items-start gap-3 py-3 px-2 cursor-pointer border-b border-cyber-border/60 last:border-b-0 active:bg-cyber-border/40 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(item.id)}
        className="peer sr-only"
      />
      {/* Checkbox kotak custom: border tebal, terisi lime saat dicentang */}
      <span
        aria-hidden
        className="mt-0.5 w-6 h-6 shrink-0 flex items-center justify-center border-2 border-cyber-border bg-cyber-bg text-sm font-black text-black peer-checked:bg-cyber-accent peer-checked:border-cyber-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyber-accent"
      >
        {checked && "✓"}
      </span>
      <span
        className={`flex-1 text-sm leading-relaxed ${
          checked ? "text-cyber-muted line-through" : "text-cyber-text"
        }`}
      >
        {item.label}
      </span>
      <span
        className={`shrink-0 mt-0.5 font-mono text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 border ${
          item.type === "praktik"
            ? "bg-cyber-accent border-cyber-accent text-black"
            : "border-cyber-border text-cyber-muted"
        }`}
      >
        {item.type}
      </span>
    </label>
  );
}

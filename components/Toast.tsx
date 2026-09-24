interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Toast({ message, actionLabel, onAction }: ToastProps) {
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-xl flex items-center justify-between gap-3 bg-cyber-surface border-2 border-cyber-accent shadow-neo-lime pl-4 pr-2 py-2"
    >
      <span className="text-sm text-cyber-text">{message}</span>
      {actionLabel && (
        <button
          onClick={onAction}
          className="shrink-0 min-h-11 px-3 font-mono text-xs font-black uppercase text-cyber-accent"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

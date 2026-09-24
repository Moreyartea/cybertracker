"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checklistData } from "@/data/checklist-data";
import { ProgressMap } from "@/types/checklist";
import { loadProgress, saveProgress, loadOpen, saveOpen } from "@/lib/storage";
import { getOverallProgress } from "@/lib/progress";
import { haptic, setupNative } from "@/lib/native";
import OverallProgress from "@/components/OverallProgress";
import ProgressBar from "@/components/ProgressBar";
import StageCard, { Filter } from "@/components/StageCard";
import Toast from "@/components/Toast";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "todo", label: "Belum" },
  { key: "konsep", label: "Konsep" },
  { key: "praktik", label: "Praktik" },
];

interface ToastState {
  message: string;
  undo?: () => void;
}

export default function Home() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const backRef = useRef<() => boolean>(() => false);

  const findNextStage = (p: ProgressMap) =>
    checklistData.find((s) => s.items.some((i) => !p[i.id]));

  const showToast = useCallback((message: string, undo?: () => void) => {
    setToast({ message, undo });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  // baca localStorage hanya di client, setelah mount
  useEffect(() => {
    const p = loadProgress();
    const saved = loadOpen();
    const first = findNextStage(p);
    setProgress(p);
    setOpenIds(new Set(saved ?? (first ? [first.id] : [])));
    setMounted(true);
  }, []);

  // simpan otomatis setiap ada perubahan (bukan di dalam state updater)
  useEffect(() => {
    if (mounted) saveProgress(progress);
  }, [progress, mounted]);
  useEffect(() => {
    if (mounted) saveOpen([...openIds]);
  }, [openIds, mounted]);

  // status bar & tombol Back Android
  backRef.current = () => {
    if (filter !== "all") {
      setFilter("all");
      return true;
    }
    if (openIds.size > 0) {
      setOpenIds(new Set());
      return true;
    }
    return false;
  };
  useEffect(() => {
    let cleanup = () => {};
    setupNative(() => backRef.current()).then((c) => (cleanup = c));
    return () => cleanup();
  }, []);

  const toggleOpen = (stageId: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const handleToggle = (itemId: string) => {
    const next = { ...progress, [itemId]: !progress[itemId] };
    setProgress(next);

    const stage = checklistData.find((s) => s.items.some((i) => i.id === itemId));
    const justCompleted =
      stage && next[itemId] && stage.items.every((i) => next[i.id]);

    if (stage && justCompleted) {
      haptic("success");
      showToast(`${stage.title} selesai`);
      // tutup stage yang selesai, buka stage berikutnya
      const upcoming = findNextStage(next);
      setOpenIds((prev) => {
        const s = new Set(prev);
        s.delete(stage.id);
        if (upcoming) s.add(upcoming.id);
        return s;
      });
    } else {
      haptic("light");
    }
  };

  const handleContinue = () => {
    const stage = findNextStage(progress);
    if (!stage) return;
    const item = stage.items.find((i) => !progress[i.id]);
    setFilter("all");
    setOpenIds((prev) => new Set(prev).add(stage.id));
    haptic("light");
    setTimeout(() => {
      document
        .getElementById(`item-${item?.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    const snapshot = progress;
    setProgress({});
    setConfirmReset(false);
    showToast("Progress direset", () => {
      setProgress(snapshot);
      setToast(null);
    });
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-cyber-muted">
          Memuat<span className="animate-pulse text-cyber-accent">_</span>
        </p>
      </main>
    );
  }

  const overall = getOverallProgress(checklistData, progress);
  const allDone = overall.total > 0 && overall.checked === overall.total;

  return (
    <main className="min-h-screen bg-cyber-bg pb-[calc(7rem+env(safe-area-inset-bottom))]">
      {/* Header lengket: progress selalu terlihat saat scroll */}
      <div className="sticky top-0 z-20 bg-cyber-bg/95 backdrop-blur border-b-2 border-cyber-border px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-cyber-accent text-black font-mono text-xs font-black px-2.5 py-0.5 tracking-wider uppercase">
              Cyber_Tracker
            </span>
            <span className="font-mono text-sm font-black text-cyber-accent">
              {overall.percent}%
            </span>
          </div>
          <ProgressBar percent={overall.percent} />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tighter leading-none text-white">
            Cyber Security Tracker
          </h1>
          <p className="text-sm text-cyber-muted mt-2">
            {checklistData.length} stage dari nol sampai siap kerja.
          </p>
        </header>

        <OverallProgress
          checked={overall.checked}
          total={overall.total}
          percent={overall.percent}
        />

        {/* Filter: geser horizontal, target sentuh 44px */}
        <div
          role="tablist"
          aria-label="Filter item"
          className="no-scrollbar -mx-4 px-4 mb-4 flex gap-2 overflow-x-auto"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 min-h-11 px-4 font-mono text-xs font-bold uppercase tracking-wide border-2 transition-colors ${
                filter === f.key
                  ? "bg-cyber-accent border-cyber-accent text-black"
                  : "bg-cyber-surface border-cyber-border text-cyber-muted active:border-cyber-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {checklistData.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              progress={progress}
              open={openIds.has(stage.id)}
              filter={filter}
              onToggleOpen={toggleOpen}
              onToggleItem={handleToggle}
            />
          ))}
        </div>

        {filter !== "all" &&
          checklistData.every((s) =>
            s.items.every((i) =>
              filter === "todo" ? !!progress[i.id] : i.type !== filter
            )
          ) && (
            <p className="text-center text-sm text-cyber-muted py-10">
              {filter === "todo"
                ? "Semua item sudah selesai."
                : "Tidak ada item untuk filter ini."}
            </p>
          )}

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleReset}
            className={`min-h-11 font-mono text-xs font-bold uppercase tracking-wide px-4 border-2 bg-cyber-surface transition-colors ${
              confirmReset
                ? "border-red-500 text-red-500 shadow-[3px_3px_0_0_#ef4444]"
                : "border-cyber-border text-cyber-muted active:border-cyber-accent"
            }`}
          >
            {confirmReset ? "Yakin? Ketuk lagi untuk reset" : "Reset semua progress"}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.undo ? "Batalkan" : undefined}
          onAction={toast.undo}
        />
      )}

      {/* Bar aksi di bawah: mudah dijangkau ibu jari */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-cyber-bg border-t-2 border-cyber-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={handleContinue}
            disabled={allDone}
            className="flex-1 min-h-12 bg-cyber-accent text-black font-mono text-sm font-black uppercase tracking-wide border-2 border-white shadow-[3px_3px_0_0_#ffffff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {allDone ? "Semua selesai ✓" : "Lanjutkan belajar"}
          </button>
          <button
            onClick={() =>
              setOpenIds(
                openIds.size > 0
                  ? new Set()
                  : new Set(checklistData.map((s) => s.id))
              )
            }
            aria-label={openIds.size > 0 ? "Tutup semua stage" : "Buka semua stage"}
            className="w-12 min-h-12 bg-cyber-surface border-2 border-cyber-border text-cyber-accent font-mono text-lg font-black active:border-cyber-accent"
          >
            {openIds.size > 0 ? "−" : "+"}
          </button>
        </div>
      </div>
    </main>
  );
}

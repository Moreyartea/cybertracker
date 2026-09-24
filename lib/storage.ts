import { ProgressMap } from "@/types/checklist";

const STORAGE_KEY = "cyber-tracker-progress";
const OPEN_KEY = "cyber-tracker-open";

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage penuh atau tidak tersedia — state React tetap jalan
  }
}

// null = belum pernah disimpan (pertama kali buka aplikasi)
export function loadOpen(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(OPEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

export function saveOpen(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OPEN_KEY, JSON.stringify(ids));
  } catch {
    // abaikan
  }
}

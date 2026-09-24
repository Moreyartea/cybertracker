import { Stage, ProgressMap } from "@/types/checklist";

export function getStageProgress(
  stage: Stage,
  progress: ProgressMap
): { checked: number; total: number; percent: number } {
  const total = stage.items.length;
  const checked = stage.items.filter((item) => progress[item.id]).length;
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  return { checked, total, percent };
}

export function getOverallProgress(
  stages: Stage[],
  progress: ProgressMap
): { checked: number; total: number; percent: number } {
  const allItems = stages.flatMap((stage) => stage.items);
  const total = allItems.length;
  const checked = allItems.filter((item) => progress[item.id]).length;
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  return { checked, total, percent };
}

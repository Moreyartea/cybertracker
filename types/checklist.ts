export type ItemType = "konsep" | "praktik";

export interface ChecklistItem {
  id: string;
  label: string;
  type: ItemType;
}

export interface Stage {
  id: string;
  number: number;
  title: string;
  description?: string;
  items: ChecklistItem[];
}

export interface ProgressMap {
  [itemId: string]: boolean;
}

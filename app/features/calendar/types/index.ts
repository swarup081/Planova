// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – Shared TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

/** A single schedulable item (task, event, or holiday placeholder). */
export interface Task {
    id: string;
    title: string;
    tag: string;
    time: string;
    desc?: string;
}

/** Map of ISO date string (YYYY-MM-DD) → list of tasks for that day. */
export type TasksMap = Record<string, Task[]>;

/** A single colour slot inside a theme palette. */
export interface ThemeSlot {
    bg: string;
    text: string;
    label: string;
    time: string;
}

/** A full monthly theme palette (3 colour slots). */
export type ThemePalette = [ThemeSlot, ThemeSlot, ThemeSlot];

/** Shape of an individual calendar grid cell. */
export interface CalendarCell {
    /** 'normal' | 'icon' | 'prev' (belongs to previous/next month) */
    type: string;
    /** Zero-padded day label, e.g. "07" */
    label: string;
    /** Optional React element rendered inside the cell */
    icon?: React.ReactNode | null;
    /** Actual day number (undefined for 'prev' cells) */
    dayNum?: number;
    /** Holiday metadata for this cell, or null */
    holiday: { name: string; desc: string } | null;
}

/** A task enriched with timeline positioning data. */
export interface TimelineTask extends Task {
    startHour: number;
    duration: number;
    isAllDay: boolean;
    trackIdx: number;
}

/** A holiday entry with display name and description. */
export interface Holiday {
    name: string;
    desc: string;
}

/** Aggregated data for a single day shown in the month task list. */
export interface MonthDayData {
    date: Date;
    dateStr: string;
    tasks: Task[];
}

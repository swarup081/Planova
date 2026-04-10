// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – Public Barrel Exports
// ─────────────────────────────────────────────────────────────────────────────
// Import from this file to consume anything in the calendar feature module.
// Avoids deep relative imports across the app.
// Avoids deep relative imports like '../../features/calendar/hooks/useTasks'.

// Types
export type { Task, TasksMap, ThemeSlot, ThemePalette, CalendarCell, TimelineTask, Holiday, MonthDayData } from './types';

// Constants
export { THEME_PALETTES, THEME_IMAGES, getThemeIndex } from './constants/themes';
export { getHoliday } from './constants/holidays';
export {
    DAYS_OF_WEEK,
    FULL_DAYS_OF_WEEK,
    HISTORICAL_FACTS,
    STORAGE_KEY_TASKS_MOBILE,
    STORAGE_KEY_TASKS_DESKTOP,
    STORAGE_KEY_NOTES,
} from './constants/days';

// Hooks
export { useCalendarGrid } from './hooks/useCalendarGrid';
export { useMonthTheme } from './hooks/useMonthTheme';
export { useTasks } from './hooks/useTasks';
export { useNotes } from './hooks/useNotes';
export { useDragSheet } from './hooks/useDragSheet';

// View Components
export { default as CalendarMobile } from './components/mobile/CalendarMobile';
export { default as CalendarDesktop } from './components/desktop/CalendarDesktop';

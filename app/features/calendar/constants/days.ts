// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – Static Calendar Data
// ─────────────────────────────────────────────────────────────────────────────

/** Abbreviated weekday labels used in the calendar grid header. */
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Full weekday labels used in the desktop month-grid header. */
export const FULL_DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;

/**
 * Rotating pool of historical facts displayed in the day summary card.
 * A fact is selected by `date.getDate() % facts.length`.
 */
export const HISTORICAL_FACTS: string[] = [
    'Apollo 10 transmitted the first color pictures of Earth from space.',
    'The Brooklyn Bridge was officially opened to traffic.',
    'The Eiffel Tower opened to the public in Paris.',
    'The first successful flight of the Wright Flyer took place.',
    'The World Wide Web went publicly available.',
    'The very first electronic network email was sent.',
];

/** localStorage key for the mobile task map. */
export const STORAGE_KEY_TASKS_MOBILE = 'calendar_app_tasks_v9';

/** localStorage key for the desktop task map. */
export const STORAGE_KEY_TASKS_DESKTOP = 'calendar_app_tasks_v16';

/** localStorage key for the notes map. */
export const STORAGE_KEY_NOTES = 'calendar_app_notes_v1';

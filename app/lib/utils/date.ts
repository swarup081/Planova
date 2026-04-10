// ─────────────────────────────────────────────────────────────────────────────
// Shared Date Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a Date object to an ISO date string in local time (YYYY-MM-DD).
 * Uses in-built getFullYear / getMonth / getDate to avoid UTC offset issues.
 */
export const dateToStr = (d: Date): string =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
        .getDate()
        .toString()
        .padStart(2, '0')}`;

/**
 * Formats a 24-hour time string ("HH:MM") to 12-hour format ("hh:mm AM/PM").
 */
export const formatTime12h = (time: string): string => {
    if (!time.includes(':')) return time;
    const [h, m] = time.split(':');
    const hourNum = parseInt(h, 10);
    return `${(hourNum % 12 || 12).toString().padStart(2, '0')}:${m} ${hourNum >= 12 ? 'PM' : 'AM'}`;
};

/**
 * Returns the number of days in a given month.
 *
 * @param year  - Full 4-digit year.
 * @param month - Zero-indexed month (0 = January).
 */
export const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

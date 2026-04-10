// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – Holiday Data & Helper
// ─────────────────────────────────────────────────────────────────────────────

import type { Holiday } from '../types';

/**
 * Static map of `"M-D"` keys to holiday metadata.
 * Covers major Indian national holidays and globally recognised dates.
 */
const HOLIDAYS: Record<string, Holiday> = {
    '1-1': {
        name: "New Year's Day",
        desc: 'The first day of the year on the modern Gregorian calendar. A time for fresh starts and resolutions.',
    },
    '1-26': {
        name: 'Republic Day',
        desc: 'Marks the date on which the Constitution of India came into effect in 1950, transitioning the country to a republic.',
    },
    '2-14': {
        name: "Valentine's Day",
        desc: 'A cultural and commercial celebration of romance and romantic love around the world.',
    },
    '3-8': {
        name: "Intl. Women's Day",
        desc: 'A global holiday celebrating the social, economic, cultural, and political achievements of women.',
    },
    '3-17': {
        name: "St. Patrick's Day",
        desc: 'A cultural and religious celebration held on the traditional death date of Saint Patrick.',
    },
    '4-8': {
        name: 'Special Holiday',
        desc: 'A special date added to the calendar to celebrate and remember.',
    },
    '4-22': {
        name: 'Earth Day',
        desc: 'An annual event to demonstrate support for environmental protection and conservation.',
    },
    '5-1': {
        name: 'Labor Day',
        desc: 'A global day to celebrate the achievements of workers and the labor movement.',
    },
    '5-5': {
        name: 'Cinco de Mayo',
        desc: "An annual celebration held to commemorate the Mexican Army's victory over the French Empire.",
    },
    '8-15': {
        name: 'Independence Day',
        desc: "Commemorates the nation's independence from the United Kingdom in 1947.",
    },
    '10-2': {
        name: 'Gandhi Jayanti',
        desc: 'Celebrates the birth anniversary of Mahatma Gandhi, a pioneer of nonviolent resistance.',
    },
    '10-31': {
        name: 'Halloween',
        desc: "A celebration observed in many countries on the eve of the Western Christian feast of All Hallows' Day.",
    },
    '12-25': {
        name: 'Christmas Day',
        desc: 'An annual festival commemorating the birth of Jesus Christ, observed primarily on December 25 as a religious and cultural celebration.',
    },
    '12-31': {
        name: "New Year's Eve",
        desc: 'The last day of the year, traditionally celebrated with parties and social gatherings leading up to midnight.',
    },
};

/**
 * Returns the holiday for a given date, or `null` if none exists.
 */
export const getHoliday = (date: Date): Holiday | null => {
    const key = `${date.getMonth() + 1}-${date.getDate()}`;
    return HOLIDAYS[key] ?? null;
};

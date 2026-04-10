// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – useMonthTheme Hook
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { THEME_PALETTES, THEME_IMAGES, getThemeIndex } from '../constants/themes';
import type { ThemePalette } from '../types';

export interface MonthThemeResult {
    /** 3-slot palette for the currently visible month. */
    monthTheme: ThemePalette;
    /** 3-slot palette for the currently selected day. */
    dayTheme: ThemePalette;
    /** Background image URL matching the current month. */
    activeImage: string;
}

/**
 * Resolves colour palettes and background images for the active month
 * and the selected day.
 *
 * @param currentMonthDate - Date representing the first day of the visible month.
 * @param selectedDate     - The currently selected calendar day.
 */
export function useMonthTheme(
    currentMonthDate: Date,
    selectedDate: Date,
): MonthThemeResult {
    return useMemo(() => {
        const monthIdx = getThemeIndex(currentMonthDate);
        const dayIdx = getThemeIndex(selectedDate);
        return {
            monthTheme: THEME_PALETTES[monthIdx],
            dayTheme: THEME_PALETTES[dayIdx],
            activeImage: THEME_IMAGES[monthIdx],
        };
    }, [currentMonthDate, selectedDate]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – useCalendarGrid Hook
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { getHoliday } from '../constants/holidays';
import type { CalendarCell } from '../types';

/**
 * Computes the 2D grid of calendar cells for a given month.
 *
 * @param currentMonthDate - A Date object set to the 1st of the desired month.
 * @returns A 2D array of `CalendarCell` rows × 7 columns.
 */
export function useCalendarGrid(currentMonthDate: Date): CalendarCell[][] {
    return useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const grid: CalendarCell[][] = [];
        let row: CalendarCell[] = [];

        // Fill leading "previous month" cells
        for (let i = 0; i < firstDay; i++) {
            row.unshift({
                type: 'prev',
                label: String(daysInPrevMonth - i).padStart(2, '0'),
                holiday: null,
            });
        }

        // Fill current month cells
        for (let i = 1; i <= daysInMonth; i++) {
            const holiday = getHoliday(new Date(year, month, i));
            row.push({
                type: 'normal',
                label: String(i).padStart(2, '0'),
                icon: null,
                dayNum: i,
                holiday,
            });

            if (row.length === 7) {
                grid.push(row);
                row = [];
            }
        }

        // Fill trailing "next month" cells
        let nextDay = 1;
        while (row.length < 7 && row.length > 0) {
            row.push({
                type: 'prev',
                label: String(nextDay).padStart(2, '0'),
                holiday: null,
            });
            nextDay++;
        }
        if (row.length > 0) grid.push(row);

        return grid;
    }, [currentMonthDate]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – useNotes Hook
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEY_NOTES } from '../constants/days';

export interface UseNotesResult {
    notes: Record<string, string>;
    setNote: (key: string, value: string) => void;
}

/**
 * Manages per-day and per-range notes with localStorage persistence.
 * The `key` is either an ISO date string (YYYY-MM-DD) or a range string
 * in the form `range:YYYY-MM-DD:YYYY-MM-DD`.
 */
export function useNotes(): UseNotesResult {
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY_NOTES);
        if (saved) {
            try {
                setNotes(JSON.parse(saved));
            } catch {
                /* ignore malformed data */
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
        }
    }, [notes, isMounted]);

    const setNote = (key: string, value: string) => {
        setNotes((prev) => ({ ...prev, [key]: value }));
    };

    return { notes, setNote };
}

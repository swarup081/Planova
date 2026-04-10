// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – useDragSheet Hook
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useRef } from 'react';

export interface UseDragSheetResult {
    isExpanded: boolean;
    sheetOffset: number;
    dragY: number;
    isDragging: React.MutableRefObject<boolean>;
    setIsExpanded: (v: boolean) => void;
    setSheetOffset: (v: number) => void;
    /** Touch-start / mouse-down handler – pass clientY */
    handleStart: (clientY: number) => void;
    /** Touch-move / mouse-move handler – pass clientY */
    handleMove: (clientY: number) => void;
    /** Touch-end / mouse-up / mouse-leave handler */
    handleEnd: () => void;
}

/**
 * Encapsulates the bottom-sheet drag gesture logic used on mobile.
 *
 * Thresholds:
 *  - dragY > 80   → collapse the sheet
 *  - dragY < -150 → expand the sheet fully (offset = -350)
 *  - otherwise    → snap back to `sheetOffset`
 */
export function useDragSheet(): UseDragSheetResult {
    const [isExpanded, setIsExpanded] = useState(false);
    const [sheetOffset, setSheetOffset] = useState(0);
    const [dragY, setDragY] = useState(0);

    const startY = useRef(0);
    const isDragging = useRef(false);

    const handleStart = (clientY: number) => {
        startY.current = clientY;
        isDragging.current = true;
    };

    const handleMove = (clientY: number) => {
        if (!isDragging.current) return;
        setDragY(Math.max(clientY - startY.current, -350 - sheetOffset));
    };

    const handleEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const totalOffset = sheetOffset + dragY;

        if (totalOffset > 80) {
            setIsExpanded(false);
            setSheetOffset(0);
            setDragY(0);
        } else if (totalOffset < -150) {
            setSheetOffset(-350);
            setDragY(0);
        } else {
            setSheetOffset(0);
            setDragY(0);
        }
    };

    return {
        isExpanded,
        sheetOffset,
        dragY,
        isDragging,
        setIsExpanded,
        setSheetOffset,
        handleStart,
        handleMove,
        handleEnd,
    };
}

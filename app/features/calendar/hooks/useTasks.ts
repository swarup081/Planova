// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – useTasks Hook
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import type { Task, TasksMap } from '../types';

interface UseTasksOptions {
    storageKey: string;
    initialTasks?: TasksMap;
}

export interface UseTasksResult {
    tasks: TasksMap;
    addTask: (task: Omit<Task, 'id'> & { date: string }) => void;
}

/**
 * Manages the task map with localStorage persistence.
 *
 * @param storageKey    - Unique localStorage key to read/write from.
 * @param initialTasks  - Seed data used only when localStorage is empty.
 */
export function useTasks({ storageKey, initialTasks = {} }: UseTasksOptions): UseTasksResult {
    const [tasks, setTasks] = useState<TasksMap>({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch {
                setTasks(initialTasks);
            }
        } else {
            setTasks(initialTasks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem(storageKey, JSON.stringify(tasks));
        }
    }, [tasks, isMounted, storageKey]);

    const addTask = ({ date, ...rest }: Omit<Task, 'id'> & { date: string }) => {
        setTasks((prev) => {
            const existing = prev[date] ?? [];
            const newTask: Task = { id: Date.now().toString(), ...rest };
            return {
                ...prev,
                [date]: [...existing, newTask].sort((a, b) => a.time.localeCompare(b.time)),
            };
        });
    };

    return { tasks, addTask };
}

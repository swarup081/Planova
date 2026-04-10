"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    X, Plus, ChevronLeft, ChevronRight, Sparkles,
    BarChart2, Briefcase, PieChart, Luggage, PartyPopper, Clock, BookOpen
} from 'lucide-react';
import { getHoliday } from '../../constants/holidays';
import { getThemeIndex, THEME_PALETTES, THEME_IMAGES } from '../../constants/themes';
import { DAYS_OF_WEEK, FULL_DAYS_OF_WEEK, STORAGE_KEY_TASKS_DESKTOP } from '../../constants/days';
import type { Task, TasksMap } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// CalendarDesktop – Desktop / Tablet-Landscape Calendar View
// ─────────────────────────────────────────────────────────────────────────────

const CalendarDesktop: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [now, setNow] = useState(new Date());

    // --- APP STATE ---
    const [realToday] = useState(new Date());
    const [activeTabId, setActiveTabId] = useState<'today' | 'month'>('month');
    const [selectedDate, setSelectedDate] = useState<Date>(realToday);
    const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
        new Date(realToday.getFullYear(), realToday.getMonth(), 1)
    );

    // --- TASKS & MODALS ---
    const [tasks, setTasks] = useState<TasksMap>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ date: '', time: '09:00', title: '', tag: 'Task' });
    const [selectedHoliday, setSelectedHoliday] = useState<{ name: string; desc: string } | null>(null);

    // --- DRAWER GESTURE STATE ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [dragY, setDragY] = useState(0);
    const startY = useRef(0);
    const isDragging = useRef(false);

    // --- ANIMATION STATE ---
    const [animationClass, setAnimationClass] = useState('slide-idle');
    const isAnimating = useRef(false);

    const todayStrKey = `${realToday.getFullYear()}-${(realToday.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${realToday.getDate().toString().padStart(2, '0')}`;

    const yesterday = new Date(realToday);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStrKey = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

    useEffect(() => {
        setIsMounted(true);
        const interval = setInterval(() => setNow(new Date()), 60000);
        const saved = localStorage.getItem(STORAGE_KEY_TASKS_DESKTOP);
        if (saved) {
            setTasks(JSON.parse(saved));
        } else {
            setTasks({
                [todayStrKey]: [
                    { id: '1', title: 'Dentist Appointment', time: '15:30', tag: 'Personal' },
                    { id: '2', title: 'Sparky goes to Groomer', time: '14:15', tag: 'Urgent' },
                ],
                [yesterdayStrKey]: [
                    { id: '3', title: 'Weekly Standup', time: '10:00', tag: 'Work' },
                ],
            });
        }
        return () => clearInterval(interval);
    }, [todayStrKey, yesterdayStrKey]);

    useEffect(() => {
        if (isMounted) localStorage.setItem(STORAGE_KEY_TASKS_DESKTOP, JSON.stringify(tasks));
    }, [tasks, isMounted]);

    // --- DRAG HANDLERS ---
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        startY.current = e.clientY;
        isDragging.current = true;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        setDragY(e.clientY - startY.current);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (isExpanded && dragY > 50) { setIsExpanded(false); setActiveTabId('month'); }
        else if (!isExpanded && dragY < -50) { setIsExpanded(true); }
        setDragY(0);
    };

    // --- DYNAMIC THEME ---
    const activeThemeIndex = getThemeIndex(currentMonthDate);
    const monthTheme = THEME_PALETTES[activeThemeIndex];
    const activeImage = THEME_IMAGES[activeThemeIndex];
    const dayTheme = THEME_PALETTES[getThemeIndex(selectedDate)];

    const fullMonthString = `${currentMonthDate.toLocaleString('default', { month: 'long' })} ${currentMonthDate.getFullYear()}`;
    const selectedDateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const todayTasksList = tasks[selectedDateStr] || [];
    const holidayToday = getHoliday(selectedDate);

    const combinedTodayTasks = useMemo(() => {
        let tasksForDay = [...todayTasksList];
        if (holidayToday)
            tasksForDay.unshift({ id: 'holiday-auto', title: holidayToday.name, time: 'All Day', tag: 'Holiday', desc: holidayToday.desc });
        return tasksForDay;
    }, [todayTasksList, holidayToday]);

    const combinedMonthTasks = useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthData: { date: Date; dateStr: string; tasks: Task[] }[] = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            let dayTasks = [...(tasks[dateStr] || [])];
            const holiday = getHoliday(date);
            if (holiday) dayTasks.unshift({ id: `holiday-${dateStr}`, title: holiday.name, time: 'All Day', tag: 'Holiday', desc: holiday.desc });
            if (dayTasks.length > 0) monthData.push({ date, dateStr, tasks: dayTasks });
        }
        return monthData;
    }, [currentMonthDate, tasks]);

    const calendarGrid = useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const grid: ReturnType<typeof Object.assign>[][] = [];
        let row: ReturnType<typeof Object.assign>[] = [];

        for (let i = 0; i < firstDay; i++)
            row.unshift({ type: 'prev', label: String(daysInPrevMonth - i).padStart(2, '0'), holiday: null });

        for (let i = 1; i <= daysInMonth; i++) {
            let icon = null;
            if (i === 3) icon = <BarChart2 size={14} className="text-stone-500" />;
            if (i === 12) icon = <Briefcase size={14} className="text-stone-500" />;
            if (i === 15) icon = <PieChart size={14} className="text-stone-500" />;
            if (i === 17) icon = <Luggage size={14} className="text-stone-500" />;
            const holiday = getHoliday(new Date(year, month, i));
            row.push({ type: icon ? 'icon' : 'normal', label: String(i).padStart(2, '0'), icon, dayNum: i, holiday });
            if (row.length === 7) { grid.push(row); row = []; }
        }

        let nextDay = 1;
        while (row.length < 7 && row.length > 0) { row.push({ type: 'prev', label: String(nextDay).padStart(2, '0'), holiday: null }); nextDay++; }
        if (row.length > 0) grid.push(row);
        return grid;
    }, [currentMonthDate]);

    // --- TIMELINE LOGIC ---
    const isSelectedToday =
        selectedDate.getDate() === realToday.getDate() &&
        selectedDate.getMonth() === realToday.getMonth() &&
        selectedDate.getFullYear() === realToday.getFullYear();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeLineX = isSelectedToday ? (currentHour + currentMin / 60) * 180 : -1;

    const timelineTasks = useMemo(() => {
        const parsedTasks = combinedTodayTasks.map(t => {
            if (t.time === 'All Day') return { ...t, startHour: 0, duration: 24, isAllDay: true };
            const parts = t.time.split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) || 0;
            return { ...t, startHour: h + m / 60, duration: 2, isAllDay: false };
        }).sort((a, b) => a.startHour - b.startHour);

        const tracks: number[] = [];
        return parsedTasks.map(task => {
            let trackIdx = tracks.findIndex(end => end <= task.startHour);
            if (trackIdx === -1) { trackIdx = tracks.length; tracks.push(task.startHour + task.duration); }
            else { tracks[trackIdx] = task.startHour + task.duration; }
            return { ...task, trackIdx };
        });
    }, [combinedTodayTasks]);

    const changeMonth = (direction: number) => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setAnimationClass(direction === 1 ? 'slide-out-left' : 'slide-out-right');
        setTimeout(() => {
            setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
            setAnimationClass(direction === 1 ? 'slide-in-right' : 'slide-in-left');
            requestAnimationFrame(() => setTimeout(() => { setAnimationClass('slide-idle'); setTimeout(() => { isAnimating.current = false; }, 300); }, 30));
        }, 350);
    };

    const handleDateClick = (dayNum: number) => {
        setSelectedDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), dayNum));
        setActiveTabId('today');
        setIsExpanded(true);
    };

    const openNewTaskModal = () => {
        setNewTask({ date: selectedDateStr, time: '09:00', title: '', tag: 'Task' });
        setIsModalOpen(true);
    };

    const handleSaveTask = () => {
        if (!newTask.title || !newTask.date) return;
        setTasks(prev => {
            const existing = prev[newTask.date] || [];
            return {
                ...prev,
                [newTask.date]: [
                    ...existing,
                    { id: Date.now().toString(), title: newTask.title, tag: newTask.tag || 'Task', time: newTask.time },
                ].sort((a, b) => a.time.localeCompare(b.time)),
            };
        });
        setIsModalOpen(false);
        setNewTask({ ...newTask, title: '', tag: 'Task' });
    };

    if (!isMounted) return null;

    return (
        <>
            <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body, html { margin: 0; overflow: hidden; width: 100vw; height: 100vh; }

        .calendar-view { transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-out, filter 0.4s ease-out; }
        .slide-out-left { transform: translateX(-40px) scale(0.95); opacity: 0; filter: blur(4px); }
        .slide-in-right { transform: translateX(40px) scale(0.95); opacity: 0; filter: blur(4px); transition: none; }
        .slide-out-right { transform: translateX(40px) scale(0.95); opacity: 0; filter: blur(4px); }
        .slide-in-left { transform: translateX(-40px) scale(0.95); opacity: 0; filter: blur(4px); transition: none; }
        .slide-idle { transform: translateX(0) scale(1); opacity: 1; filter: blur(0px); }

        .tab-view-enter { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; z-index: 10; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .tab-view-exit { opacity: 0; transform: translateY(15px) scale(0.97); pointer-events: none; z-index: 0; transition: all 0.4s ease-out; }
      `}</style>

            <div className="h-screen w-screen bg-white flex flex-col overflow-hidden font-sans transition-colors duration-700">

                {/* DESKTOP GLOBAL HEADER */}
                <header className="h-[76px] bg-white border-b border-stone-100 flex items-center justify-between px-8 shrink-0 z-20 relative">
                    <div className="text-[22px] font-normal tracking-tight text-stone-800">
                        Plan<span style={{ color: monthTheme[2].text }}>ova</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={openNewTaskModal}
                            className="px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
                            style={{ backgroundColor: monthTheme[2].text, color: monthTheme[0].bg }}
                        >
                            <Plus size={16} /> New Event
                        </button>
                    </div>
                </header>

                {/* MAIN LAYOUT */}
                <div className="flex flex-1 overflow-hidden relative">

                    {/* LEFT SIDEBAR */}
                    <div className="w-[300px] lg:w-[360px] xl:w-[420px] h-full flex flex-col bg-[#F4F2EC] relative overflow-hidden shrink-0 border-r border-stone-200">

                        {/* 1. X Button (visible when expanded) */}
                        <div className="absolute top-6 left-0 w-full px-6 z-50 flex items-center justify-between pointer-events-none">
                            <button
                                onClick={() => { setIsExpanded(false); setActiveTabId('month'); }}
                                className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-700 hover:bg-stone-50 transition-all duration-300 pointer-events-auto border border-white/50 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                            >
                                <X size={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* 2. Scenic Background Image */}
                        <div className="absolute top-[70px] left-0 w-full px-6 z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center pointer-events-none">
                            <div
                                className={`w-full bg-cover bg-center rounded-[32px] shadow-sm transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? 'opacity-0 scale-95 h-[100px]' : 'opacity-100 scale-100 h-[300px]'}`}
                                style={{ backgroundImage: `url("${activeImage}")` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-[32px]"></div>
                            </div>
                        </div>

                        {/* 3. Floating Mini Calendar Card */}
                        <div
                            className="absolute left-0 w-full px-6 z-30 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ top: isExpanded ? '90px' : '260px' }}
                        >
                            <div className="relative w-full h-[360px]">
                                <div className="absolute inset-0 rounded-[32px] p-6 shadow-xl border border-white/50 transition-colors duration-700" style={{ backgroundColor: monthTheme[0].bg }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-[17px] font-medium transition-colors duration-500" style={{ color: monthTheme[2].text }}>
                                            {currentMonthDate.toLocaleString('default', { month: 'long' })}, {currentMonthDate.getFullYear()}
                                        </h2>
                                        <div className="flex items-center gap-1 pointer-events-auto">
                                            <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: monthTheme[2].text }}><ChevronLeft size={16} /></button>
                                            <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: monthTheme[2].text }}><ChevronRight size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 mb-3 text-center">
                                        {DAYS_OF_WEEK.map(day => (
                                            <div key={day} className="text-[11px] font-medium transition-colors duration-500" style={{ color: monthTheme[1].text }}>{day}</div>
                                        ))}
                                    </div>

                                    <div className={`calendar-view ${animationClass}`}>
                                        <div className={`grid grid-cols-7 ${calendarGrid.length > 5 ? 'gap-y-1' : 'gap-y-2'} gap-x-1`}>
                                            {calendarGrid.map((row, rowIndex) => (
                                                <React.Fragment key={rowIndex}>
                                                    {row.map((col, colIndex) => {
                                                        const isActive = col.dayNum === selectedDate.getDate() && currentMonthDate.getMonth() === selectedDate.getMonth() && currentMonthDate.getFullYear() === selectedDate.getFullYear();
                                                        const isToday = col.dayNum === realToday.getDate() && currentMonthDate.getMonth() === realToday.getMonth() && currentMonthDate.getFullYear() === realToday.getFullYear();

                                                        let cellClasses = `relative mx-auto rounded-full flex items-center justify-center text-[13px] font-medium cursor-pointer transition-all duration-300 hover:scale-110 pointer-events-auto w-9 h-9`;
                                                        let extraStyles: React.CSSProperties = {};

                                                        if (col.type === 'prev') {
                                                            cellClasses += " overflow-hidden opacity-50";
                                                            extraStyles = { background: 'repeating-linear-gradient(-45deg, #00000005, #00000005 4px, #00000000 4px, #00000000 8px)', color: monthTheme[1].text };
                                                        } else if (isActive) {
                                                            cellClasses += " shadow-sm scale-110";
                                                            extraStyles = { backgroundColor: monthTheme[2].bg, color: monthTheme[2].text };
                                                        } else if (col.type === 'normal') {
                                                            extraStyles = { color: monthTheme[2].time };
                                                        } else if (col.type === 'icon') {
                                                            extraStyles = { backgroundColor: monthTheme[0].text + '20' };
                                                        }

                                                        return (
                                                            <div key={`${rowIndex}-${colIndex}`} className={cellClasses} style={extraStyles} onClick={() => col.type !== 'prev' && col.dayNum && handleDateClick(col.dayNum)}>
                                                                {col.type === 'prev' && <div className="absolute inset-0 backdrop-blur-[1px] rounded-full pointer-events-none"></div>}
                                                                <span className="relative z-10 pointer-events-none">{col.icon && !isActive ? col.icon : col.label}</span>
                                                                {col.holiday && !isActive && <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400 opacity-80 pointer-events-none"></div>}
                                                                {isToday && !isActive && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full pointer-events-none" style={{ backgroundColor: monthTheme[2].text }} />}
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Draggable Bottom Drawer */}
                        <div
                            className="absolute left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border-t border-white/60 rounded-t-[36px]"
                            style={{
                                top: isExpanded ? '450px' : 'calc(100% - 90px)',
                                height: 'calc(100% - 90px)',
                                backgroundColor: activeTabId === 'month' ? monthTheme[0].bg : dayTheme[0].bg,
                                transform: `translateY(${dragY}px)`,
                                transition: isDragging.current ? 'none' : 'top 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        >
                            {/* Drag Handle */}
                            <div
                                className="w-full pt-4 pb-5 flex justify-center shrink-0 cursor-grab active:cursor-grabbing pointer-events-auto"
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                onPointerLeave={handlePointerUp}
                            >
                                <div className="w-14 h-1.5 rounded-full opacity-30" style={{ backgroundColor: activeTabId === 'month' ? monthTheme[2].text : dayTheme[2].text }}></div>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-20 relative">

                                {/* Monthly Highlights */}
                                <div className={`absolute w-[calc(100%-48px)] ${activeTabId === 'month' ? 'tab-view-enter' : 'tab-view-exit'}`}>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-[16px] font-medium" style={{ color: monthTheme[2].text }}>Monthly Highlights</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-medium px-2.5 py-1 bg-black/5 rounded-md" style={{ color: monthTheme[1].text }}>{combinedMonthTasks.length} Days</span>
                                            <button onClick={openNewTaskModal} className="p-1.5 rounded-full hover:bg-black/5 transition-colors pointer-events-auto" style={{ color: monthTheme[2].text }}>
                                                <Plus size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {combinedMonthTasks.length > 0 ? (
                                            combinedMonthTasks.map(({ date, dateStr, tasks: dayTasks }) => (
                                                <div
                                                    key={dateStr}
                                                    onClick={() => handleDateClick(date.getDate())}
                                                    className="rounded-[24px] p-5 flex hover:shadow-sm transition-all duration-300 overflow-x-auto hide-scrollbar cursor-pointer select-none border"
                                                    style={{ backgroundColor: monthTheme[0].bg, borderColor: `${monthTheme[1].bg}50` }}
                                                >
                                                    <div className="min-w-[70px] flex flex-col justify-center shrink-0">
                                                        <span className="text-[32px] font-normal leading-none mb-1" style={{ color: monthTheme[0].text }}>{date.getDate().toString().padStart(2, '0')}</span>
                                                        <span className="text-[11px] font-medium" style={{ color: monthTheme[0].label }}>{date.toLocaleString('default', { weekday: 'short' })}</span>
                                                    </div>
                                                    <div className="flex gap-4 ml-3 shrink-0">
                                                        {dayTasks.map((task, i) => {
                                                            const cTheme = monthTheme[i % monthTheme.length];
                                                            const isHoliday = task.tag === 'Holiday';
                                                            return (
                                                                <div key={task.id} className="flex flex-col border-l pl-4" style={{ borderColor: monthTheme[1].bg }}>
                                                                    <span className="text-[10px] font-medium mb-3" style={{ color: isHoliday ? '#EF4444' : monthTheme[0].time }}>
                                                                        {isHoliday ? 'SPECIAL' : task.time}
                                                                    </span>
                                                                    <span
                                                                        onClick={(e) => { if (isHoliday && task.desc) { e.stopPropagation(); setSelectedHoliday({ name: task.title, desc: task.desc }); } }}
                                                                        className={`inline-block text-[11px] px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors duration-500 ${isHoliday ? 'cursor-pointer hover:brightness-95 pointer-events-auto' : 'pointer-events-none'}`}
                                                                        style={{ backgroundColor: isHoliday ? '#FEE2E2' : cTheme.bg, color: isHoliday ? '#DC2626' : cTheme.text }}
                                                                    >
                                                                        {task.title}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-sm" style={{ color: monthTheme[1].text }}>No tasks added this month.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Daily Focus */}
                                <div className={`absolute w-[calc(100%-48px)] ${activeTabId === 'today' ? 'tab-view-enter' : 'tab-view-exit'}`}>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-[16px] font-medium" style={{ color: dayTheme[2].text }}>
                                            {selectedDate.getDate() === realToday.getDate() && selectedDate.getMonth() === realToday.getMonth() ? "Today's Focus" : "Daily Focus"}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            {combinedTodayTasks.length > 0 && (
                                                <span className="text-[11px] font-medium px-2.5 py-1 bg-black/5 rounded-md" style={{ color: dayTheme[1].text }}>{combinedTodayTasks.length} Events</span>
                                            )}
                                            <button onClick={openNewTaskModal} className="p-1.5 rounded-full hover:bg-black/5 transition-colors pointer-events-auto" style={{ color: dayTheme[2].text }}>
                                                <Plus size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col relative pb-[100px]">
                                        {combinedTodayTasks.length > 0 ? (
                                            combinedTodayTasks.map((task, index) => {
                                                const theme = dayTheme[index % dayTheme.length];
                                                const isHoliday = task.id === 'holiday-auto';
                                                let formattedTime = task.time;
                                                if (task.time.includes(':')) {
                                                    const [h, m] = task.time.split(':');
                                                    const hourNum = parseInt(h, 10);
                                                    formattedTime = `${(hourNum % 12 || 12).toString().padStart(2, '0')}:${m} ${hourNum >= 12 ? 'PM' : 'AM'}`;
                                                }
                                                return (
                                                    <div
                                                        key={task.id}
                                                        onClick={() => isHoliday && task.desc ? setSelectedHoliday({ name: task.title, desc: task.desc }) : null}
                                                        className={`sticky rounded-[32px] px-6 py-8 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.04)] border border-black/5 transition-colors duration-700 pointer-events-auto ${isHoliday ? 'cursor-pointer hover:brightness-95' : ''}`}
                                                        style={{ backgroundColor: theme.bg, top: `${index * 24}px`, marginTop: index > 0 ? '-24px' : '0px', zIndex: 10 + index }}
                                                    >
                                                        <div className="flex flex-col">
                                                            {isHoliday && <div className="flex items-center gap-1 mb-1.5"><span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.label }}>Moments to Celebrate</span></div>}
                                                            <h3 className="text-[28px] leading-none font-extralight tracking-tight" style={{ color: theme.text }}>{task.title}</h3>
                                                        </div>
                                                        <div className="flex flex-col items-end pr-1">
                                                            <span className="text-[9px] font-medium mb-1 uppercase tracking-wider text-right" style={{ color: theme.label }}>{isHoliday ? 'Special' : 'Start'}</span>
                                                            <span className={`text-[17px] font-light text-right ${isHoliday ? 'text-red-500/80 font-medium' : ''}`} style={{ color: isHoliday ? undefined : theme.time }}>{formattedTime}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-10 text-sm" style={{ color: dayTheme[1].text }}>Schedule is clear! Take a break.</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT MAIN PANEL */}
                    <div className="flex-1 relative bg-white">
                        <div className="relative z-10 h-full flex flex-col p-5 lg:p-8 xl:p-10">

                            <div className="flex justify-between items-center mb-10">
                                <h1 className="text-[28px] font-normal tracking-tight transition-colors duration-700" style={{ color: monthTheme[2].text }}>
                                    {fullMonthString}
                                </h1>
                                <div className="flex items-center bg-stone-50 p-1 rounded-full border border-stone-200/60">
                                    <button
                                        onClick={() => { setActiveTabId('month'); setIsExpanded(false); }}
                                        className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTabId === 'month' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                                        style={{ color: activeTabId === 'month' ? monthTheme[2].text : monthTheme[1].label }}
                                    >
                                        Month
                                    </button>
                                    <button
                                        onClick={() => { setActiveTabId('today'); setIsExpanded(true); }}
                                        className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTabId === 'today' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                                        style={{ color: activeTabId === 'today' ? monthTheme[2].text : monthTheme[1].label }}
                                    >
                                        Today
                                    </button>
                                </div>
                            </div>

                            {/* DYNAMIC VIEWS */}
                            {activeTabId === 'month' ? (
                                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-7 mb-4 border-b pb-4" style={{ borderColor: monthTheme[1].bg }}>
                                        {FULL_DAYS_OF_WEEK.map(day => (
                                            <div key={day} className="text-[13px] font-medium text-center" style={{ color: monthTheme[1].text }}>{day}</div>
                                        ))}
                                    </div>

                                    <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-[1px] rounded-[24px] overflow-hidden border" style={{ backgroundColor: monthTheme[1].bg, borderColor: monthTheme[1].bg }}>
                                        {calendarGrid.map((row) =>
                                            row.map((col, idx) => {
                                                const dateStr = col.type === 'normal' || col.type === 'icon'
                                                    ? `${currentMonthDate.getFullYear()}-${(currentMonthDate.getMonth() + 1).toString().padStart(2, '0')}-${String(col.dayNum).padStart(2, '0')}`
                                                    : '';
                                                const dayTasks = tasks[dateStr] || [];
                                                const isToday = col.dayNum === realToday.getDate() && currentMonthDate.getMonth() === realToday.getMonth();

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 flex flex-col transition-colors cursor-pointer ${col.type === 'prev' ? 'opacity-40' : 'hover:brightness-95'}`}
                                                        style={{ backgroundColor: monthTheme[0].bg }}
                                                        onClick={() => col.type !== 'prev' && col.dayNum && handleDateClick(col.dayNum)}
                                                    >
                                                        <span
                                                            className={`text-sm mb-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isToday ? 'font-semibold' : 'font-medium'}`}
                                                            style={isToday ? { backgroundColor: monthTheme[2].bg, color: monthTheme[2].text } : { color: monthTheme[2].time }}
                                                        >
                                                            {col.label}
                                                        </span>
                                                        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                                                            {col.holiday && (
                                                                <div className="flex items-center gap-2">
                                                                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                                                                    <span className="text-[11px] truncate font-medium text-amber-600">{col.holiday.name}</span>
                                                                </div>
                                                            )}
                                                            {dayTasks.slice(0, 3).map((t: Task, i: number) => (
                                                                <div key={i} className="flex items-center gap-2">
                                                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.tag === 'Personal' ? 'bg-[#5C9A6E]' : t.tag === 'Urgent' ? 'bg-[#B35973]' : 'bg-[#8A72A2]'}`}></div>
                                                                    <span className="text-[11px] truncate font-medium" style={{ color: monthTheme[2].text }}>{t.title}</span>
                                                                </div>
                                                            ))}
                                                            {dayTasks.length > 3 && <span className="text-[10px] mt-1 pl-3.5" style={{ color: monthTheme[1].label }}>+{dayTasks.length - 3} more</span>}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
                                    <h2 className="text-[20px] font-medium mb-6 shrink-0" style={{ color: dayTheme[2].text }}>
                                        Focus for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h2>

                                    {/* Horizontal Timeline */}
                                    <div className="flex-1 relative overflow-hidden rounded-[32px] border shadow-sm" style={{ backgroundColor: dayTheme[0].bg, borderColor: dayTheme[1].bg }}>
                                        <div
                                            className="absolute inset-0 overflow-auto hide-scrollbar scroll-smooth"
                                            ref={(el) => {
                                                if (el && !el.dataset.scrolled) {
                                                    const targetHour = isSelectedToday ? currentHour : 8;
                                                    el.scrollLeft = Math.max(0, (targetHour * 180) - 200);
                                                    el.dataset.scrolled = "true";
                                                }
                                            }}
                                        >
                                            <div className="min-w-max relative pb-20" style={{ width: '4500px', minHeight: '100%' }}>

                                                {/* Hour Header */}
                                                <div className="h-[80px] border-b relative sticky top-0 z-30 backdrop-blur-md" style={{ borderColor: dayTheme[1].bg, backgroundColor: `${dayTheme[0].bg}E0` }}>
                                                    {Array.from({ length: 25 }).map((_, i) => {
                                                        const displayHour = i === 0 || i === 24 ? 12 : i > 12 ? i - 12 : i;
                                                        const ampm = i >= 12 && i < 24 ? 'PM' : 'AM';
                                                        return (
                                                            <div key={i} className="absolute bottom-0 h-full flex flex-col justify-end pb-3 pointer-events-none" style={{ left: `${i * 180}px`, transform: 'translateX(-50%)' }}>
                                                                <div className="flex flex-col items-center gap-0.5">
                                                                    <span className="text-[32px] leading-none font-light tracking-tighter" style={{ color: dayTheme[2].text }}>{displayHour.toString().padStart(2, '0')}</span>
                                                                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: dayTheme[1].text }}>{ampm}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Timeline Grid & Tasks */}
                                                <div className="relative w-full h-[600px] mt-4">
                                                    {Array.from({ length: 25 }).map((_, i) => (
                                                        <div key={i} className="absolute top-0 bottom-0 w-px pointer-events-none" style={{ left: `${i * 180}px`, backgroundColor: `${dayTheme[1].bg}80` }} />
                                                    ))}

                                                    {/* Current Time Indicator */}
                                                    {currentTimeLineX >= 0 && (
                                                        <div className="absolute top-0 bottom-0 w-px z-20 pointer-events-none" style={{ left: `${currentTimeLineX}px`, backgroundColor: dayTheme[2].text }}>
                                                            <div className="w-2.5 h-2.5 rounded-full absolute -left-[4.5px] -top-1" style={{ backgroundColor: dayTheme[2].text }}></div>
                                                        </div>
                                                    )}

                                                    {/* Task Blocks */}
                                                    {timelineTasks.map((task, index) => {
                                                        const theme = dayTheme[index % dayTheme.length];
                                                        const isHoliday = task.isAllDay;
                                                        const left = task.startHour * 180;
                                                        const width = task.duration * 180;
                                                        const top = task.trackIdx * 64;
                                                        return (
                                                            <div
                                                                key={task.id}
                                                                className={`absolute h-[48px] rounded-[14px] flex items-center px-4 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all z-10 ${isHoliday ? 'border-2 border-dashed' : 'border'}`}
                                                                style={{
                                                                    left: `${left + 2}px`,
                                                                    width: `${Math.max(width - 4, 100)}px`,
                                                                    top: `${top}px`,
                                                                    backgroundColor: isHoliday ? `${dayTheme[1].bg}40` : theme.bg,
                                                                    borderColor: isHoliday ? dayTheme[1].text : `${theme.label}50`,
                                                                    color: theme.text,
                                                                }}
                                                                onClick={() => isHoliday && task.desc ? setSelectedHoliday({ name: task.title, desc: task.desc }) : null}
                                                            >
                                                                <div className="truncate flex-1 flex items-center gap-2.5">
                                                                    {isHoliday && <PartyPopper size={14} className="shrink-0 opacity-80" />}
                                                                    {task.tag === 'Work' && <Briefcase size={14} className="shrink-0 opacity-70" />}
                                                                    {task.tag === 'Task' && <Clock size={14} className="shrink-0 opacity-70" />}
                                                                    <div className="flex flex-col justify-center flex-1 truncate">
                                                                        <span className="text-[13px] font-medium leading-tight block truncate">{task.title}</span>
                                                                        {!isHoliday && (
                                                                            <span className="text-[10px] font-medium opacity-70 leading-tight block mt-0.5">
                                                                                {task.time} - {(() => {
                                                                                    const [h, m] = task.time.split(':').map(Number);
                                                                                    const endH = h + task.duration;
                                                                                    const endHour12 = endH % 12 || 12;
                                                                                    const endAmPm = endH >= 12 && endH < 24 ? 'PM' : 'AM';
                                                                                    return `${endHour12}:${m.toString().padStart(2, '0')} ${endAmPm}`;
                                                                                })()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {timelineTasks.length === 0 && (
                                                        <div className="absolute top-10 left-10 p-8 rounded-3xl border-2 border-dashed flex items-center gap-4 pointer-events-none" style={{ borderColor: dayTheme[1].bg, color: dayTheme[1].text }}>
                                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/50">
                                                                <BookOpen size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium mb-1">Clear Schedule</p>
                                                                <p className="text-xs opacity-70">Nothing planned on the timeline for today.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ADD TASK MODAL */}
                {isModalOpen && (
                    <div className="absolute inset-0 z-[100] bg-black/30 backdrop-blur-sm flex justify-center items-center pointer-events-auto">
                        <div className="bg-[#F9F8F6] w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-white">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[22px] font-normal text-stone-800">New Event</h3>
                                <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors shadow-sm">
                                    <X size={18} strokeWidth={1.5} />
                                </button>
                            </div>
                            <div className="space-y-5 mb-8">
                                <div>
                                    <label className="block text-[12px] font-medium text-stone-500 mb-1.5 pl-2">Title</label>
                                    <input type="text" placeholder="e.g. Discovery Meeting" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-white border-none rounded-2xl px-5 py-3.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[12px] font-medium text-stone-500 mb-1.5 pl-2">Date</label>
                                        <input type="date" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} className="w-full bg-white border-none rounded-2xl px-5 py-3.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[12px] font-medium text-stone-500 mb-1.5 pl-2">Time</label>
                                        <input type="time" value={newTask.time} onChange={e => setNewTask({ ...newTask, time: e.target.value })} className="w-full bg-white border-none rounded-2xl px-5 py-3.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-medium text-stone-500 mb-1.5 pl-2">Tag</label>
                                    <select value={newTask.tag} onChange={e => setNewTask({ ...newTask, tag: e.target.value })} className="w-full bg-white border-none rounded-2xl px-5 py-3.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm appearance-none">
                                        <option value="Task">Task</option>
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveTask}
                                disabled={!newTask.title || !newTask.date}
                                className="w-full text-white font-medium rounded-2xl py-4 transition-all duration-300 disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] shadow-md"
                                style={{ backgroundColor: monthTheme[2].text }}
                            >
                                Save Event
                            </button>
                        </div>
                    </div>
                )}

                {/* HOLIDAY INFO MODAL */}
                {selectedHoliday && (
                    <div className="absolute inset-0 z-[100] bg-black/20 backdrop-blur-sm flex justify-center items-center pointer-events-auto px-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedHoliday(null); }}>
                        <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center relative border border-red-100">
                            <button onClick={() => setSelectedHoliday(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors">
                                <X size={16} />
                            </button>
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <PartyPopper size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-normal text-stone-800 mb-3 tracking-tight">{selectedHoliday.name}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed font-medium">{selectedHoliday.desc}</p>
                            <button onClick={() => setSelectedHoliday(null)} className="mt-8 w-full bg-stone-100 text-stone-700 font-medium rounded-2xl py-3 hover:bg-stone-200 transition-colors">Close</button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default CalendarDesktop;

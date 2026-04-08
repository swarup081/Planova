"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  X, MoreVertical, Plus, Code, PartyPopper,
  ChevronLeft, ChevronRight, BarChart2, Briefcase, PieChart, Luggage 
} from 'lucide-react';

// --- TYPES ---
interface Task {
  id: string;
  title: string;
  tag: string;
  time: string;
  desc?: string; 
}
type TasksMap = Record<string, Task[]>;

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- THEMES & IMAGES ---
const THEME_PALETTES = [
  [ { bg: '#FCFDFB', text: '#6D726A', label: '#A0A59E', time: '#4D5449' }, { bg: '#E8FA7D', text: '#636E17', label: '#8C9C26', time: '#4A5311' }, { bg: '#B0B6AA', text: '#3C4238', label: '#61685D', time: '#252922' } ], // 0: Jan 
  [ { bg: '#F2F9FA', text: '#5C7A7E', label: '#8BA6AA', time: '#3E5C60' }, { bg: '#D0F0F0', text: '#2A6666', label: '#5C9A9A', time: '#1C4A4A' }, { bg: '#A0C0D0', text: '#1E3B4D', label: '#486D82', time: '#122633' } ], // 1: Feb 
  [ { bg: '#F8F8F8', text: '#555555', label: '#888888', time: '#333333' }, { bg: '#CCFF00', text: '#333300', label: '#556600', time: '#1A1A00' }, { bg: '#FF007F', text: '#FFE6F2', label: '#FFB3D9', time: '#FFF' } ], // 2: Original Mar
  [ { bg: '#FFF9F7', text: '#8B6A62', label: '#D1B0A8', time: '#5E443F' }, { bg: '#FFE5D9', text: '#8B402E', label: '#C47C6A', time: '#5A261A' }, { bg: '#F4ACB7', text: '#5C1A24', label: '#A24A58', time: '#3D0F16' } ], // 3: Apr 
  [ { bg: '#F2FAF4', text: '#5C7A64', label: '#8AA692', time: '#3C5243' }, { bg: '#D8F3DC', text: '#2A5C38', label: '#5C9A6E', time: '#1A3D24' }, { bg: '#95D5B2', text: '#123A22', label: '#387550', time: '#0B2414' } ], // 4: May 
  [ { bg: '#F9F5FB', text: '#7A6E7A', label: '#C2B6C6', time: '#524952' }, { bg: '#E8DFF5', text: '#4C3666', label: '#8A72A2', time: '#332344' }, { bg: '#B19CD9', text: '#2A184D', label: '#5C4488', time: '#190E2E' } ], // 5: Jun 
  [ { bg: '#F7F7F7', text: '#606060', label: '#A0A0A0', time: '#404040' }, { bg: '#E0E0E0', text: '#202020', label: '#606060', time: '#111111' }, { bg: '#A0A0A0', text: '#101010', label: '#404040', time: '#000000' } ], // 6: Jul 
  [ { bg: '#FFFBF2', text: '#7A6640', label: '#C6B28A', time: '#534428' }, { bg: '#FFF3B0', text: '#665212', label: '#A68A38', time: '#44360A' }, { bg: '#E09F3E', text: '#3E2204', label: '#884D16', time: '#251301' } ], // 7: Aug 
  [ { bg: '#FFF7F5', text: '#7A5E56', label: '#C6A8A0', time: '#533E38' }, { bg: '#FFD6BA', text: '#8B381A', label: '#C4724A', time: '#5C220E' }, { bg: '#FEC89A', text: '#5C220E', label: '#A85638', time: '#381206' } ], // 8: Sep 
  [ { bg: '#F2F8FB', text: '#405060', label: '#90A0B0', time: '#2A3642' }, { bg: '#CAF0F8', text: '#12405C', label: '#387A9A', time: '#0A293D' }, { bg: '#90E0EF', text: '#0A263E', label: '#2A5A7A', time: '#041626' } ], // 9: Oct 
  [ { bg: '#FFF6F8', text: '#7A5C5C', label: '#C6A4A4', time: '#533B3B' }, { bg: '#FAD2E1', text: '#5C2238', label: '#A85A72', time: '#3D1524' }, { bg: '#E2CFC4', text: '#4C322A', label: '#8A6A5C', time: '#311F19' } ], // 10: Nov 
  [ { bg: '#FBF8F6', text: '#6E5C4E', label: '#B6A69A', time: '#4A3D33' }, { bg: '#EDE0D4', text: '#4C362A', label: '#8A7262', time: '#33231B' }, { bg: '#E6CCB2', text: '#3E2A1E', label: '#7A5C4C', time: '#281A11' } ], // 11: Dec 
  
  // 12: SPECIAL MARCH THEME (Cherry Blossom Pink)
  [ { bg: '#FFF5F8', text: '#8B4256', label: '#D18EA0', time: '#5E2B3A' }, { bg: '#FFD1DC', text: '#661A2D', label: '#B35973', time: '#3D0F1A' }, { bg: '#FFB7C5', text: '#4A0C1D', label: '#993D54', time: '#2E0610' } ] 
];

const THEME_IMAGES = [
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1550684848-FAC1C5B4E853?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1440688807730-73e4e20eff66?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1546026423-cc46426ba658?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",  
  
  // SPECIAL MARCH IMAGE (Cherry Blossoms)
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800&auto=format&fit=crop"
];

// --- HOLIDAY HELPER ---
const getHoliday = (date: Date): { name: string, desc: string } | null => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const key = `${m}-${d}`;
  
  const HOLIDAYS: Record<string, { name: string, desc: string }> = {
    '1-1': { name: "New Year's Day", desc: "The first day of the year on the modern Gregorian calendar. A time for fresh starts and resolutions." },
    '1-26': { name: "Republic Day", desc: "Marks the date on which the Constitution of India came into effect in 1950, transitioning the country to a republic." },
    '2-14': { name: "Valentine's Day", desc: "A cultural and commercial celebration of romance and romantic love around the world." },
    '3-8': { name: "Intl. Women's Day", desc: "A global holiday celebrating the social, economic, cultural, and political achievements of women." },
    '3-17': { name: "St. Patrick's Day", desc: "A cultural and religious celebration held on the traditional death date of Saint Patrick." },
    '4-8': { name: "Special Holiday", desc: "A special date added to the calendar to celebrate and remember." }, 
    '4-22': { name: "Earth Day", desc: "An annual event to demonstrate support for environmental protection and conservation." },
    '5-1': { name: "Labor Day", desc: "A global day to celebrate the achievements of workers and the labor movement." },
    '5-5': { name: "Cinco de Mayo", desc: "An annual celebration held to commemorate the Mexican Army's victory over the French Empire." },
    '8-15': { name: "Independence Day", desc: "Commemorates the nation's independence from the United Kingdom in 1947." },
    '10-2': { name: "Gandhi Jayanti", desc: "Celebrates the birth anniversary of Mahatma Gandhi, a pioneer of nonviolent resistance." },
    '10-31': { name: "Halloween", desc: "A celebration observed in many countries on the eve of the Western Christian feast of All Hallows' Day." },
    '12-25': { name: "Christmas Day", desc: "An annual festival commemorating the birth of Jesus Christ, observed primarily on December 25 as a religious and cultural celebration." },
    '12-31': { name: "New Year's Eve", desc: "The last day of the year, traditionally celebrated with parties and social gatherings leading up to midnight." }
  };
  
  return HOLIDAYS[key] || null;
};

const AppMaster: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  // --- APP STATE ---
  const [realToday] = useState(new Date()); 
  const [activeTabId, setActiveTabId] = useState<'today' | 'month'>('month');
  
  const [selectedDate, setSelectedDate] = useState<Date>(realToday);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(realToday.getFullYear(), realToday.getMonth(), 1));

  // --- TASKS & MODAL STATE ---
  const [tasks, setTasks] = useState<TasksMap>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ date: '', time: '09:00', title: '', tag: '' });
  
  // --- HOLIDAY DETAILS MODAL ---
  const [selectedHoliday, setSelectedHoliday] = useState<{name: string, desc: string} | null>(null);

  // --- CALENDAR ANIMATION STATE ---
  const [animationClass, setAnimationClass] = useState('slide-idle');
  const isAnimating = useRef(false);

  // --- DRAG GESTURE STATE ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0); 
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const todayStrKey = `${realToday.getFullYear()}-${(realToday.getMonth()+1).toString().padStart(2,'0')}-${realToday.getDate().toString().padStart(2,'0')}`;

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('calendar_app_tasks_v9');
    if (saved) setTasks(JSON.parse(saved));
    else {
      setTasks({
        [todayStrKey]: [
          { id: '1', title: 'Sales', time: '15:20', tag: 'Work' },
          { id: '2', title: 'Design', time: '18:20', tag: 'Creative' }
        ]
      });
    }
  }, [todayStrKey]);

  useEffect(() => { if (isMounted) localStorage.setItem('calendar_app_tasks_v9', JSON.stringify(tasks)); }, [tasks, isMounted]);

  // --- DYNAMIC THEME SELECTION ---
  const getThemeIndex = (date: Date) => {
    if (date.getMonth() === 2) return 12; // March Override (Cherry Blossom)
    return Math.abs((date.getFullYear() * 12 + date.getMonth()) % 12);
  };

  const activeThemeIndex = getThemeIndex(currentMonthDate);
  const monthTheme = THEME_PALETTES[activeThemeIndex];
  const activeImage = THEME_IMAGES[activeThemeIndex];
  const dayTheme = THEME_PALETTES[getThemeIndex(selectedDate)];

  const monthString = `${currentMonthDate.toLocaleString('default', { month: 'long' })}, ${currentMonthDate.getFullYear()}`;
  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const selectedDateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth()+1).toString().padStart(2,'0')}-${selectedDate.getDate().toString().padStart(2,'0')}`;
  
  const todayTasksList = tasks[selectedDateStr] || [];
  const holidayToday = getHoliday(selectedDate);

  // --- COMBINED TODAY TASKS ---
  const combinedTodayTasks = useMemo(() => {
    let tasksForDay = [...todayTasksList];
    if (holidayToday) {
       tasksForDay.unshift({
          id: 'holiday-auto', title: holidayToday.name, time: 'All Day', tag: 'Holiday', desc: holidayToday.desc
       });
    }
    return tasksForDay;
  }, [todayTasksList, holidayToday]);

  // --- COMBINED MONTH TASKS ---
  const combinedMonthTasks = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let monthData: { date: Date, dateStr: string, tasks: Task[] }[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${i.toString().padStart(2,'0')}`;
      let dayTasks = [...(tasks[dateStr] || [])];
      const holiday = getHoliday(date);
      
      if (holiday) {
         dayTasks.unshift({
            id: `holiday-${dateStr}`, title: holiday.name, time: 'All Day', tag: 'Holiday', desc: holiday.desc
         });
      }
      
      if (dayTasks.length > 0) {
        monthData.push({ date, dateStr, tasks: dayTasks });
      }
    }
    return monthData;
  }, [currentMonthDate, tasks]);

  const getHistoricalFact = (date: Date) => {
    const facts = [
      "Apollo 10 transmitted the first color pictures of Earth from space.",
      "The Brooklyn Bridge was officially opened to traffic.",
      "The Eiffel Tower opened to the public in Paris.",
      "The first successful flight of the Wright Flyer took place.",
      "The World Wide Web went publicly available.",
      "The very first electronic network email was sent."
    ];
    return facts[date.getDate() % facts.length];
  };

  // --- CALENDAR LOGIC ---
  const calendarGrid = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];
    let row = [];

    for (let i = 0; i < firstDay; i++) row.unshift({ type: 'prev', label: String(daysInPrevMonth - i).padStart(2, '0'), holiday: null });

    for (let i = 1; i <= daysInMonth; i++) {
      let icon = null;
      if (i === 3) icon = <BarChart2 size={16} className="text-stone-500" />;
      if (i === 12) icon = <Briefcase size={16} className="text-stone-500" />;
      if (i === 15) icon = <PieChart size={16} className="text-stone-500" />;
      if (i === 17) icon = <Luggage size={16} className="text-stone-500" />;
      
      const holiday = getHoliday(new Date(year, month, i));
      row.push({ type: icon ? 'icon' : 'normal', label: String(i).padStart(2, '0'), icon, dayNum: i, holiday });
      
      if (row.length === 7) { grid.push(row); row = []; }
    }

    let nextDay = 1;
    while (row.length < 7 && row.length > 0) { row.push({ type: 'prev', label: String(nextDay).padStart(2, '0'), holiday: null }); nextDay++; }
    if (row.length > 0) grid.push(row);

    return grid;
  }, [currentMonthDate]);

  const isSixRows = calendarGrid.length > 5;

  // --- HANDLERS ---
  const handleDateClick = (dayNum: number) => {
    setSelectedDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), dayNum));
    setIsExpanded(true);
    setSheetOffset(0); 
  };

  const jumpToRealToday = () => {
    setSelectedDate(realToday);
    setCurrentMonthDate(new Date(realToday.getFullYear(), realToday.getMonth(), 1));
    setActiveTabId('today');
    setIsExpanded(true);
    setSheetOffset(0);
  };

  const changeMonth = (direction: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setAnimationClass(direction === 1 ? 'slide-out-left' : 'slide-out-right');
    setTimeout(() => {
      setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
      setAnimationClass(direction === 1 ? 'slide-in-right' : 'slide-in-left');
      requestAnimationFrame(() => {
        setTimeout(() => { setAnimationClass('slide-idle'); setTimeout(() => { isAnimating.current = false; }, 300); }, 30);
      });
    }, 350); 
  };

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.date) return;
    setTasks(prev => {
      const existing = prev[newTask.date] || [];
      return {
        ...prev,
        [newTask.date]: [...existing, { id: Date.now().toString(), title: newTask.title, tag: newTask.tag || 'Task', time: newTask.time }]
          .sort((a, b) => a.time.localeCompare(b.time))
      };
    });
    setIsModalOpen(false);
    setNewTask({ ...newTask, title: '', tag: '' });
  };

  const handleStart = (clientY: number) => { startY.current = clientY; isDragging.current = true; };
  const handleMove = (clientY: number) => {
    if (!isDragging.current) return;
    setDragY(Math.max(clientY - startY.current, -350 - sheetOffset));
  };
  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const totalOffset = sheetOffset + dragY;
    if (totalOffset > 80) { setIsExpanded(false); setSheetOffset(0); setDragY(0); }
    else if (totalOffset < -150) { setSheetOffset(-350); setDragY(0); }
    else { setSheetOffset(0); setDragY(0); }
  };

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .calendar-view { transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-out, filter 0.4s ease-out; }
        .slide-out-left { transform: translateX(-80px) scale(0.95); opacity: 0; filter: blur(4px); }
        .slide-in-right { transform: translateX(80px) scale(0.95); opacity: 0; filter: blur(4px); transition: none; }
        .slide-out-right { transform: translateX(80px) scale(0.95); opacity: 0; filter: blur(4px); }
        .slide-in-left { transform: translateX(-80px) scale(0.95); opacity: 0; filter: blur(4px); transition: none; }
        .slide-idle { transform: translateX(0) scale(1); opacity: 1; filter: blur(0px); }
        
        .tab-view-enter { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; z-index: 10; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .tab-view-exit { opacity: 0; transform: translateY(15px) scale(0.97); pointer-events: none; z-index: 0; transition: all 0.4s ease-out; }
      `}</style>
      
      <div className={`h-[100dvh] w-full relative overflow-hidden font-sans text-stone-800 flex justify-center selection:bg-black/10 transition-colors duration-700 bg-[#F4F2EC]`}>
        
        {/* FIXED HEADER & TABS */}
        <div className="absolute top-[max(env(safe-area-inset-top,1.5rem),1.5rem)] sm:top-[2rem] left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto">
            
            <header className="flex items-center justify-between mb-6">
              {/* Only show the cross button in Month tab when expanded */}
              <button className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-700 hover:bg-stone-50 transition-all duration-300 border border-white/50 ${!isExpanded || activeTabId === 'today' ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`} onClick={() => setIsExpanded(false)}>
                <X size={18} strokeWidth={1.5} />
              </button>
              <h1 className="text-[22px] sm:text-[26px] font-normal text-stone-800 tracking-tight">Calander</h1>
              {/* more vertical is for future update to add profile and all*/ }
              <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-700 hover:bg-stone-50 transition-colors border border-white/50 opacity-0 pointer-events-none">
                <MoreVertical size={18} strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex items-center gap-2 sm:gap-3 mb-8">
              <button
                onClick={jumpToRealToday}
                className={`px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  activeTabId === 'today' ? 'bg-white text-stone-800 shadow-sm border border-transparent' : 'bg-transparent border border-stone-300/60 text-stone-500 backdrop-blur-md hover:bg-white/30'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => { setActiveTabId('month'); setIsExpanded(true); setSheetOffset(0); }}
                className={`px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  activeTabId === 'month' ? 'bg-white text-stone-800 shadow-sm border border-transparent' : 'bg-transparent border border-stone-300/60 text-stone-500 backdrop-blur-md hover:bg-white/30'
                }`}
              >
                Month
              </button>
              <button onClick={() => { setNewTask({ ...newTask, date: selectedDateStr }); setIsModalOpen(true); }} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-300/60 bg-white/50 backdrop-blur-md flex items-center justify-center text-stone-600 hover:bg-white transition-colors shrink-0 ml-auto pointer-events-auto">
                <Plus size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC IMAGE BACKGROUND */}
        <div className="absolute top-[170px] left-0 w-full flex justify-center px-4 pointer-events-none z-10">
          <div className={`w-full max-w-md rounded-[32px] bg-cover bg-center shadow-sm transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`} style={{ backgroundImage: `url("${activeImage}")`, height: 'calc(100dvh - 300px)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-[32px] transition-colors duration-700"></div>
          </div>
        </div>

        {/* --- UNIFIED TOP CARD CONTAINER --- */}
        <div className="absolute left-0 w-full flex justify-center px-4 pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-30" style={{ top: isExpanded ? '170px' : 'calc(100dvh - 380px)' }}>
          <div className="relative w-full max-w-md h-[360px] shrink-0">
            
            {/* View 1: CALENDAR CARD */}
            <div className={`absolute inset-0 rounded-[32px] p-6 shadow-xl border border-stone-100 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeTabId === 'month' ? 'tab-view-enter' : 'tab-view-exit'}`} style={{ backgroundColor: monthTheme[0].bg }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium min-w-[120px] transition-colors duration-500" style={{ color: monthTheme[2].text }}>{monthString}</h2>
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button onClick={() => changeMonth(-1)} className="w-9 h-9 border border-stone-100/50 rounded-[10px] flex items-center justify-center transition-colors" style={{ backgroundColor: monthTheme[0].bg, color: monthTheme[2].text }}><ChevronLeft size={18} /></button>
                  <button onClick={() => changeMonth(1)} className="w-9 h-9 border border-stone-100/50 rounded-[10px] flex items-center justify-center transition-colors" style={{ backgroundColor: monthTheme[0].bg, color: monthTheme[2].text }}><ChevronRight size={18} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4 text-center">
                {daysOfWeek.map(day => (<div key={day} className="text-xs sm:text-sm font-medium transition-colors duration-500" style={{ color: monthTheme[1].text }}>{day}</div>))}
              </div>

              <div className={`calendar-view ${animationClass}`}>
                <div className={`grid grid-cols-7 ${isSixRows ? 'gap-y-1 sm:gap-y-1.5' : 'gap-y-2 sm:gap-y-3'} gap-x-1 sm:gap-x-2`}>
                  {calendarGrid.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {row.map((col, colIndex) => {
                        const isActive = col.dayNum === selectedDate.getDate() && currentMonthDate.getMonth() === selectedDate.getMonth() && currentMonthDate.getFullYear() === selectedDate.getFullYear();
                        
                        let cellClasses = `relative mx-auto rounded-full flex items-center justify-center text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-110 pointer-events-auto ${isSixRows ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-10 sm:h-10'}`;
                        let extraStyles = {};

                        if (col.type === 'prev') { cellClasses += " overflow-hidden opacity-50"; extraStyles = { background: 'repeating-linear-gradient(-45deg, #00000005, #00000005 4px, #00000000 4px, #00000000 8px)', color: monthTheme[1].text }; } 
                        else if (isActive) { 
                          cellClasses += " shadow-sm scale-110"; 
                          extraStyles = { backgroundColor: monthTheme[2].bg, color: monthTheme[2].text }; 
                        } 
                        else if (col.type === 'normal') { extraStyles = { color: monthTheme[2].time }; } 
                        else if (col.type === 'icon') { extraStyles = { backgroundColor: monthTheme[0].text + '20' }; }

                        return (
                          <div key={`${rowIndex}-${colIndex}`} className={cellClasses} style={extraStyles} onClick={() => col.dayNum && handleDateClick(col.dayNum)}>
                            {col.type === 'prev' && <div className="absolute inset-0 backdrop-blur-[1px] rounded-full pointer-events-none"></div>}
                            <span className="relative z-10 pointer-events-none">{col.icon && !isActive ? col.icon : col.label}</span>
                            {/* Holiday Indicator Dot */}
                            {col.holiday && !isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400 opacity-80 pointer-events-none"></div>}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* View 2: TODAY SUMMARY CARD */}
            <div className={`absolute inset-0 rounded-[32px] p-6 shadow-xl border border-stone-100 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeTabId === 'today' ? 'tab-view-enter' : 'tab-view-exit'}`} style={{ backgroundColor: dayTheme[0].bg }}>
               <div className="flex items-start justify-between mb-6 px-2">
                <div>
                  <h2 className="text-[19px] font-medium mb-1 flex items-center gap-2" style={{ color: dayTheme[2].time }}>
                    {formattedSelectedDate}
                    {holidayToday && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-red-100 text-red-600 border border-red-200/50 cursor-pointer pointer-events-auto hover:bg-red-200 transition-colors" onClick={() => setSelectedHoliday(holidayToday)}>{holidayToday.name}</span>}
                  </h2>
                  <p className="text-[12px] font-medium leading-relaxed max-w-[240px]" style={{ color: dayTheme[1].text }}>
                    {getHistoricalFact(selectedDate)}
                  </p>
                </div>
                <Code size={20} className="mt-1 shrink-0" style={{ color: dayTheme[1].text }} strokeWidth={1.5} />
              </div>
              
              <div className="flex gap-3 h-[180px]">
                <div className="flex-1 rounded-[28px] p-4 sm:p-5 pt-6 sm:pt-8 flex flex-col justify-end transition-colors duration-700" style={{ backgroundColor: dayTheme[2].bg }}>
                  <span className="text-[36px] sm:text-[44px] leading-none font-light mb-1 tracking-tight" style={{ color: dayTheme[2].text }}>{combinedTodayTasks.length}</span>
                  <p className="text-[10px] sm:text-[11px] font-medium" style={{ color: dayTheme[2].label }}>Total Items</p>
                </div>
                <div className="flex-1 rounded-[28px] p-4 sm:p-5 pt-6 sm:pt-8 flex flex-col justify-end transition-colors duration-700" style={{ backgroundColor: dayTheme[1].bg }}>
                  <span className="text-[36px] sm:text-[44px] leading-none font-light mb-1 tracking-tight" style={{ color: dayTheme[1].text }}>{combinedTodayTasks.length > 0 ? (combinedTodayTasks.length * 1.5) : 0}h</span>
                  <p className="text-[10px] sm:text-[11px] font-medium" style={{ color: dayTheme[1].label }}>Avg Per Day</p>
                </div>
                <div className="flex-1 rounded-[28px] p-4 sm:p-5 pt-6 sm:pt-8 flex flex-col justify-end border border-black/5 transition-colors duration-700" style={{ backgroundColor: dayTheme[0].bg }}>
                  <span className="text-[36px] sm:text-[44px] leading-none font-light mb-1 tracking-tight" style={{ color: dayTheme[0].text }}>72h</span>
                  <p className="text-[10px] sm:text-[11px] font-medium" style={{ color: dayTheme[0].label }}>Total Hours</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- UNIFIED BOTTOM SHEET / TASKS DRAWER --- */}
        <div 
          className="absolute w-full flex justify-center px-0 sm:px-4 will-change-transform z-40"
          style={{ 
            top: isExpanded ? '540px' : '100dvh', height: 'calc(100dvh - 170px)', 
            transform: `translateY(${sheetOffset + dragY}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), top 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <div className="w-full max-w-md flex-1 bg-white/95 backdrop-blur-xl rounded-t-[40px] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border-t border-white/60 pointer-events-auto transition-colors duration-700" style={{ backgroundColor: activeTabId === 'month' ? monthTheme[0].bg : dayTheme[0].bg }}>
            
            <div className="w-full pt-5 pb-6 flex justify-center shrink-0 cursor-grab active:cursor-grabbing" onTouchStart={(e) => handleStart(e.touches[0].clientY)} onTouchMove={(e) => handleMove(e.touches[0].clientY)} onTouchEnd={handleEnd} onMouseDown={(e) => handleStart(e.clientY)} onMouseMove={(e) => handleMove(e.clientY)} onMouseUp={handleEnd} onMouseLeave={handleEnd}>
              <div className="w-14 h-1.5 rounded-full opacity-30" style={{ backgroundColor: activeTabId === 'month' ? monthTheme[2].text : dayTheme[2].text }}></div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-32 relative">
              <div className="relative w-full h-full">
                
                {/* MONTH TAB TASKS */}
                <div className={`absolute w-full ${activeTabId === 'month' ? 'tab-view-enter' : 'tab-view-exit'}`}>
                  <div className="rounded-[32px] p-6 shadow-sm border border-stone-100/50 min-h-[400px] bg-white/40 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium" style={{ color: monthTheme[2].text }}>Monthly Tasks</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] sm:text-xs hidden sm:inline-block" style={{ color: monthTheme[1].text }}>Double-click to view</span>
                        <button onClick={() => { setNewTask({ ...newTask, date: selectedDateStr }); setIsModalOpen(true); }} className="hover:opacity-60 transition-opacity pointer-events-auto" style={{ color: monthTheme[2].text }}>
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>

                    <div className={`space-y-4 calendar-view ${animationClass}`}>
                      {isMounted && combinedMonthTasks.length > 0 ? (
                        combinedMonthTasks.map(({ date, dateStr, tasks: dayTasks }) => {
                          return (
                            <div 
                              key={dateStr} 
                              onDoubleClick={() => { setSelectedDate(date); setActiveTabId('today'); setIsExpanded(true); setSheetOffset(0); }} 
                              className="rounded-[24px] p-4 sm:p-5 flex hover:shadow-md transition-all duration-500 overflow-x-auto hide-scrollbar cursor-pointer select-none"
                              style={{ backgroundColor: monthTheme[0].bg, border: `1px solid ${monthTheme[1].bg}40` }}
                            >
                              <div className="min-w-[70px] sm:min-w-[90px] flex flex-col justify-center shrink-0">
                                <span className="text-3xl sm:text-4xl font-normal leading-none mb-1" style={{ color: monthTheme[0].text }}>{date.getDate().toString().padStart(2,'0')}</span>
                                <span className="text-[10px] sm:text-xs font-medium" style={{ color: monthTheme[0].label }}>{date.toLocaleString('default', { weekday: 'short' })}</span>
                              </div>
                              <div className="flex gap-4 ml-2 sm:ml-4 shrink-0">
                                {dayTasks.map((task, i) => {
                                  const cTheme = monthTheme[i % monthTheme.length];
                                  const isHoliday = task.tag === 'Holiday';
                                  
                                  return (
                                    <div key={task.id} className="flex flex-col border-l pl-3 sm:pl-4" style={{ borderColor: monthTheme[1].bg }}>
                                      <span className="text-[10px] font-medium mb-3" style={{ color: isHoliday ? '#EF4444' : monthTheme[0].time }}>
                                        {isHoliday ? 'SPECIAL' : task.time}
                                      </span>
                                      <span 
                                        onClick={(e) => {
                                          if (isHoliday && task.desc) {
                                            e.stopPropagation();
                                            setSelectedHoliday({ name: task.title, desc: task.desc });
                                          }
                                        }}
                                        className={`inline-block text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium whitespace-nowrap transition-colors duration-500 ${isHoliday ? 'cursor-pointer hover:brightness-95 pointer-events-auto' : 'pointer-events-none'}`} 
                                        style={{ backgroundColor: isHoliday ? '#FEE2E2' : cTheme.bg, color: isHoliday ? '#DC2626' : cTheme.text }}
                                      >
                                        {task.title}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-sm" style={{ color: monthTheme[1].text }}>No tasks added for this month yet.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* TODAY TAB TASKS */}
                <div className={`absolute w-full ${activeTabId === 'today' ? 'tab-view-enter' : 'tab-view-exit'}`}>
                  <div className="rounded-[32px] p-6 shadow-sm border border-stone-100/50 min-h-[400px] bg-white/40 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium" style={{ color: dayTheme[2].text }}>
                        {selectedDate.getDate() === realToday.getDate() && selectedDate.getMonth() === realToday.getMonth() ? "Today's Tasks" : "Daily Tasks"}
                      </h2>
                      <button onClick={() => { setNewTask({ ...newTask, date: selectedDateStr }); setIsModalOpen(true); }} className="hover:opacity-60 transition-opacity pointer-events-auto" style={{ color: dayTheme[2].text }}>
                        <Plus size={24} />
                      </button>
                    </div>

                    <div className="flex flex-col relative pb-[150px]">
                      {combinedTodayTasks.length > 0 ? combinedTodayTasks.map((task, index) => {
                        const theme = dayTheme[index % dayTheme.length];
                        const isHoliday = task.id === 'holiday-auto';
                        
                        let formattedTime = task.time;
                        if (task.time.includes(':')) {
                          const [h, m] = task.time.split(':');
                          const hourNum = parseInt(h, 10);
                          formattedTime = `${(hourNum % 12 || 12).toString().padStart(2, '0')}:${m} ${hourNum >= 12 ? 'PM' : 'AM'}`;
                        }

                        return (
                          <div key={task.id} 
                            onClick={() => isHoliday && task.desc ? setSelectedHoliday({name: task.title, desc: task.desc}) : null}
                            className={`sticky rounded-[40px] px-6 py-8 sm:py-10 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.04)] border border-black/5 transition-colors duration-700 pointer-events-auto ${isHoliday ? 'cursor-pointer hover:brightness-95' : ''}`}
                            style={{ 
                              backgroundColor: theme.bg, 
                              top: `${index * 24}px`, 
                              marginTop: index > 0 ? '-30px' : '0px',
                              zIndex: 10 + index 
                            }}
                          >
                            <div className="flex flex-col">
                              {isHoliday && <div className="flex items-center gap-1 mb-1"><span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.label }}>Moments to Celebrate</span></div>}
                              <h3 className="text-[32px] sm:text-[42px] leading-none font-extralight tracking-tight" style={{ color: theme.text }}>
                                {task.title}
                              </h3>
                            </div>
                            <div className="flex flex-col items-end pr-2">
                              <span className="text-[9px] sm:text-[10px] font-medium mb-1 uppercase tracking-wider text-right" style={{ color: theme.label }}>
                                {isHoliday ? 'Special' : 'Start'}
                              </span>
                              <span className={`text-[16px] sm:text-[20px] font-light text-right ${isHoliday ? 'text-red-500/80 font-medium' : ''}`} style={{ color: isHoliday ? undefined : theme.time }}>
                                {formattedTime}
                              </span>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-center py-12 text-sm" style={{ color: dayTheme[1].text }}>No tasks for this day. Relax!</div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* --- ADD TASK MODAL OVERLAY --- */}
        {isModalOpen && (
          <div className="absolute inset-0 z-[100] bg-black/20 backdrop-blur-sm flex justify-center items-end sm:items-center pointer-events-auto">
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-stone-800">New Task</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1 pl-2">Title</label>
                  <input type="text" placeholder="e.g. Gym Session" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-[#F9F8F6] border-none rounded-2xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-stone-500 mb-1 pl-2">Date</label>
                    <input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} className="w-full bg-[#F9F8F6] border-none rounded-2xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-stone-500 mb-1 pl-2">Time</label>
                    <input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} className="w-full bg-[#F9F8F6] border-none rounded-2xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200" />
                  </div>
                </div>
              </div>

              <button onClick={handleSaveTask} disabled={!newTask.title || !newTask.date} className="w-full bg-[#D7CEC3] text-stone-900 font-medium rounded-2xl py-3.5 hover:bg-[#C9C0B5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Save Task
              </button>
            </div>
          </div>
        )}

        {/* --- HOLIDAY INFO MODAL OVERLAY --- */}
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
              <p className="text-sm text-stone-500 leading-relaxed font-medium">
                {selectedHoliday.desc}
              </p>
              <button onClick={() => setSelectedHoliday(null)} className="mt-8 w-full bg-stone-100 text-stone-700 font-medium rounded-2xl py-3 hover:bg-stone-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AppMaster;
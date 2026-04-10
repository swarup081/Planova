# Planova 🗓️

> A beautiful, responsive calendar & task-planning application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📱 **Responsive Layout** | Separate, optimised views for mobile/tablet and desktop |
| 🎨 **Dynamic Theming** | Unique colour palette per calendar month (13 themes) |
| 📅 **Month Calendar** | Interactive grid with animated month transitions |
| 📆 **Day View** | Stacked task cards with holiday integration |
| 🕐 **Timeline View** | Horizontal 24-hour timeline on desktop with live time indicator |
| ↔️ **Date Range Selector** | Select a date range directly from the calendar grid |
| 📝 **Notes** | Per-day and per-range sticky notes stored in `localStorage` |
| ✅ **Task Management** | Add, view, and persist tasks via a sleek modal |
| 🎉 **Holiday Awareness** | Built-in Indian & global holiday calendar with info pop-ups |
| 🖼️ **Scenic Images** | Month-matched Unsplash backgrounds |
| 💾 **Offline Persistence** | All tasks and notes saved to `localStorage` — no backend required |

---

## 🖥️ Screenshots

| Mobile View | Desktop View |
|---|---|
| Bottom-sheet drawer, animated calendar card, gesture drag | Left sidebar with mini-calendar + scenic image, right panel with timeline |

---

## 📁 Project Structure

```
planova/
├── app/                              # Next.js App Router root
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   ├── page.tsx                      # Responsive dispatcher (mobile vs desktop)
│   ├── globals.css                   # Global styles & Tailwind CSS v4 import
│   │
│   └── features/
│       └── calendar/                 # Calendar feature module
│           ├── index.ts              # Public barrel exports
│           │
│           ├── types/
│           │   └── index.ts          # Shared TypeScript interfaces & types
│           │
│           ├── constants/
│           │   ├── themes.ts         # THEME_PALETTES & THEME_IMAGES
│           │   ├── holidays.ts       # Holiday data & getHoliday() helper
│           │   └── days.ts           # daysOfWeek & other static data
│           │
│           ├── hooks/
│           │   ├── useCalendarGrid.ts  # Calendar grid computation (useMemo)
│           │   ├── useMonthTheme.ts    # Dynamic theme resolution hook
│           │   ├── useTasks.ts         # Task CRUD + localStorage persistence
│           │   ├── useNotes.ts         # Notes CRUD + localStorage persistence
│           │   └── useDragSheet.ts     # Bottom-sheet drag gesture hook
│           │
│           ├── components/
│           │   ├── mobile/           # Mobile-first calendar view
│           │   │   ├── CalendarMobile.tsx        # Root mobile component
│           │   │   ├── CalendarCard.tsx           # Month grid card
│           │   │   ├── TodaySummaryCard.tsx       # Day stats card
│           │   │   └── BottomSheet.tsx            # Draggable bottom drawer
│           │   │
│           │   └── desktop/          # Desktop calendar view
│           │       ├── CalendarDesktop.tsx        # Root desktop component
│           │       ├── Sidebar.tsx                # Left panel (mini-cal + drawer)
│           │       ├── MainPanel.tsx              # Right panel (timeline / month grid)
│           │       ├── HorizontalTimeline.tsx     # 24-hour horizontal timeline
│           │       └── DesktopMonthGrid.tsx       # Full-width month calendar
│           │
│           └── modals/
│               ├── AddTaskModal.tsx              # New task / event form
│               └── HolidayInfoModal.tsx          # Holiday detail pop-up
│
├── public/                           # Static assets
│   └── favicon.ico
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or `yarn` / `pnpm` / `bun`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/planova.git
cd planova

# 2. Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
The app hot-reloads on every file change.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | [Geist Sans + Geist Mono](https://vercel.com/font) via `next/font` |
| Persistence | Browser `localStorage` |
| Images | [Unsplash](https://unsplash.com) (CDN, no API key needed) |

---

## 🎨 Theming System

Each calendar month gets a unique 3-slot colour palette (`bg`, `text`, `label`, `time`) plus a matching Unsplash background image. March has a special **Cherry Blossom** override theme (index 12).

```typescript
// Theme index resolution
const getThemeIndex = (date: Date) =>
  date.getMonth() === 2        // March → Cherry Blossom
    ? 12
    : Math.abs((date.getFullYear() * 12 + date.getMonth()) % 12);
```

---

## 📱 Responsive Behaviour

The root `page.tsx` uses a `matchMedia` query to choose between layouts:

| Viewport | Component |
|---|---|
| `≥ 1024px` or `≥ 768px landscape` | `CalendarDesktop` |
| `< 1024px` (portrait) | `CalendarMobile` |

Rendering is deferred until the first viewport measurement to **prevent hydration flash**.

---

## 💾 Data Persistence

All user data is stored locally in the browser using `localStorage`:

| Key | Content |
|---|---|
| `calendar_app_tasks_v9` | Mobile task map (`Record<dateStr, Task[]>`) |
| `calendar_app_tasks_v16` | Desktop task map (`Record<dateStr, Task[]>`) |
| `calendar_app_notes_v1` | Notes map (`Record<key, string>`) |

> **Note:** Data is per-browser and will be cleared if the user clears their browser storage. A backend integration layer (e.g. Supabase, Firebase) can be added in future.

---

## 🗺️ Roadmap

- [ ] User authentication & cloud sync
- [ ] Recurring events support
- [ ] Drag-and-drop task rescheduling
- [ ] Week view
- [ ] Export to `.ics` / Google Calendar
- [ ] Dark mode support
- [ ] Push notification reminders
- [ ] Mobile PWA support

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow the existing code style and keep components focused and single-responsibility.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Background images courtesy of [Unsplash](https://unsplash.com)
- Icons by [Lucide](https://lucide.dev)
- Font by [Vercel / Geist](https://vercel.com/font)

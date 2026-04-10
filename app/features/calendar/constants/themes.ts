// ─────────────────────────────────────────────────────────────────────────────
// Calendar Feature – Theme Palettes & Background Images
// ─────────────────────────────────────────────────────────────────────────────

import type { ThemePalette } from '../types';

/**
 * 13-slot theme palette array.
 * Indices 0-11 correspond to January-December.
 * Index 12 is the special Cherry Blossom override used for March.
 */
export const THEME_PALETTES: ThemePalette[] = [
    // 0: January – Soft Sage
    [
        { bg: '#FCFDFB', text: '#6D726A', label: '#A0A59E', time: '#4D5449' },
        { bg: '#E8FA7D', text: '#636E17', label: '#8C9C26', time: '#4A5311' },
        { bg: '#B0B6AA', text: '#3C4238', label: '#61685D', time: '#252922' },
    ],
    // 1: February – Ice Blue
    [
        { bg: '#F2F9FA', text: '#5C7A7E', label: '#8BA6AA', time: '#3E5C60' },
        { bg: '#D0F0F0', text: '#2A6666', label: '#5C9A9A', time: '#1C4A4A' },
        { bg: '#A0C0D0', text: '#1E3B4D', label: '#486D82', time: '#122633' },
    ],
    // 2: March – Neon Monochrome
    [
        { bg: '#F8F8F8', text: '#555555', label: '#888888', time: '#333333' },
        { bg: '#CCFF00', text: '#333300', label: '#556600', time: '#1A1A00' },
        { bg: '#FF007F', text: '#FFE6F2', label: '#FFB3D9', time: '#FFF' },
    ],
    // 3: April – Warm Rose
    [
        { bg: '#FFF9F7', text: '#8B6A62', label: '#D1B0A8', time: '#5E443F' },
        { bg: '#FFE5D9', text: '#8B402E', label: '#C47C6A', time: '#5A261A' },
        { bg: '#F4ACB7', text: '#5C1A24', label: '#A24A58', time: '#3D0F16' },
    ],
    // 4: May – Forest Green
    [
        { bg: '#F2FAF4', text: '#5C7A64', label: '#8AA692', time: '#3C5243' },
        { bg: '#D8F3DC', text: '#2A5C38', label: '#5C9A6E', time: '#1A3D24' },
        { bg: '#95D5B2', text: '#123A22', label: '#387550', time: '#0B2414' },
    ],
    // 5: June – Lavender
    [
        { bg: '#F9F5FB', text: '#7A6E7A', label: '#C2B6C6', time: '#524952' },
        { bg: '#E8DFF5', text: '#4C3666', label: '#8A72A2', time: '#332344' },
        { bg: '#B19CD9', text: '#2A184D', label: '#5C4488', time: '#190E2E' },
    ],
    // 6: July – Storm Grey
    [
        { bg: '#F7F7F7', text: '#606060', label: '#A0A0A0', time: '#404040' },
        { bg: '#E0E0E0', text: '#202020', label: '#606060', time: '#111111' },
        { bg: '#A0A0A0', text: '#101010', label: '#404040', time: '#000000' },
    ],
    // 7: August – Golden Hour
    [
        { bg: '#FFFBF2', text: '#7A6640', label: '#C6B28A', time: '#534428' },
        { bg: '#FFF3B0', text: '#665212', label: '#A68A38', time: '#44360A' },
        { bg: '#E09F3E', text: '#3E2204', label: '#884D16', time: '#251301' },
    ],
    // 8: September – Peach Dusk
    [
        { bg: '#FFF7F5', text: '#7A5E56', label: '#C6A8A0', time: '#533E38' },
        { bg: '#FFD6BA', text: '#8B381A', label: '#C4724A', time: '#5C220E' },
        { bg: '#FEC89A', text: '#5C220E', label: '#A85638', time: '#381206' },
    ],
    // 9: October – Ocean Blue
    [
        { bg: '#F2F8FB', text: '#405060', label: '#90A0B0', time: '#2A3642' },
        { bg: '#CAF0F8', text: '#12405C', label: '#387A9A', time: '#0A293D' },
        { bg: '#90E0EF', text: '#0A263E', label: '#2A5A7A', time: '#041626' },
    ],
    // 10: November – Dusty Rose
    [
        { bg: '#FFF6F8', text: '#7A5C5C', label: '#C6A4A4', time: '#533B3B' },
        { bg: '#FAD2E1', text: '#5C2238', label: '#A85A72', time: '#3D1524' },
        { bg: '#E2CFC4', text: '#4C322A', label: '#8A6A5C', time: '#311F19' },
    ],
    // 11: December – Warm Linen
    [
        { bg: '#FBF8F6', text: '#6E5C4E', label: '#B6A69A', time: '#4A3D33' },
        { bg: '#EDE0D4', text: '#4C362A', label: '#8A7262', time: '#33231B' },
        { bg: '#E6CCB2', text: '#3E2A1E', label: '#7A5C4C', time: '#281A11' },
    ],
    // 12: SPECIAL MARCH OVERRIDE – Cherry Blossom Pink
    [
        { bg: '#FFF5F8', text: '#8B4256', label: '#D18EA0', time: '#5E2B3A' },
        { bg: '#FFD1DC', text: '#661A2D', label: '#B35973', time: '#3D0F1A' },
        { bg: '#FFB7C5', text: '#4A0C1D', label: '#993D54', time: '#2E0610' },
    ],
];

/**
 * Matching scenic background image URLs from Unsplash.
 * Index 0-11 → January-December, Index 12 → Cherry Blossom (March override).
 */
export const THEME_IMAGES: string[] = [
    'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=90&w=1200&auto=format&fit=crop', // Jan
    'https://images.unsplash.com/photo-1439405326854-014607f694d7?q=90&w=1200&auto=format&fit=crop', // Feb
    'https://images.unsplash.com/photo-1550684848-FAC1C5B4E853?q=90&w=1200&auto=format&fit=crop', // Mar
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=90&w=1200&auto=format&fit=crop', // Apr
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=90&w=1200&auto=format&fit=crop', // May
    'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=90&w=1200&auto=format&fit=crop', // Jun
    'https://images.unsplash.com/photo-1440688807730-73e4e20eff66?q=90&w=1200&auto=format&fit=crop', // Jul
    'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?q=90&w=1200&auto=format&fit=crop', // Aug
    'https://images.unsplash.com/photo-1546026423-cc46426ba658?q=90&w=1200&auto=format&fit=crop', // Sep
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=90&w=1200&auto=format&fit=crop', // Oct
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=90&w=1200&auto=format&fit=crop', // Nov
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=90&w=1200&auto=format&fit=crop', // Dec
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=90&w=1200&auto=format&fit=crop', // Cherry Blossom
];

/**
 * Resolves the theme palette index for a given date.
 * March always uses the Cherry Blossom override (index 12).
 */
export const getThemeIndex = (date: Date): number =>
    date.getMonth() === 2
        ? 12
        : Math.abs((date.getFullYear() * 12 + date.getMonth()) % 12);

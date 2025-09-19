// npm i @tanstack/react-table @tanstack/react-virtual @radix-ui/react-dropdown-menu @radix-ui/react-dialog

export const tokens = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            900: '#1e3a8a'
        },
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827'
        },
        red: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c'
        },
        green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d'
        },
        amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309'
        },
        white: '#ffffff',
        black: '#000000'
    },
    spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem'
    },
    radius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px'
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    },
    typography: {
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
        },
        lineHeight: {
            none: '1',
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.625'
        }
    },
    zIndex: {
        dropdown: 50,
        sticky: 40,
        modal: 100,
        overlay: 90,
        tooltip: 60
    },
    iconSizes: {
        xs: '0.75rem',
        sm: '1rem',
        md: '1.25rem',
        lg: '1.5rem',
        xl: '2rem'
    }
} as const;

export type ColorTokens = typeof tokens.colors;
export type SpacingTokens = typeof tokens.spacing;
export type RadiusTokens = typeof tokens.radius;
export type ShadowTokens = typeof tokens.shadows;
export type TypographyTokens = typeof tokens.typography;
export type ZIndexTokens = typeof tokens.zIndex;
export type IconSizeTokens = typeof tokens.iconSizes;

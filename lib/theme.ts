export const theme = {
    colors: {
        // Background colors
        background: {
            primary: '#F1F1F1',
            secondary: '#FAFAFA',
            tertiary: '#FFFFFF',
        },
        // Accent colors
        accent: {
            primary: '#B473FF',
            secondary: '#9917FF',
            tertiary: '#9917FF',
            blue: '#3B82F6',
            green: '#10B981',
            gold: '#F59E0B',
            red: '#EF4444',
        },
        // Text colors
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
            tertiary: '#999999',
        },
        // UI colors
        border: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.3)',
        glass: 'rgba(255, 255, 255, 0.8)',
    },

    typography: {
        fontFamily: {
            primary: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            secondary: "var(--font-roboto), sans-serif",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
    },

    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        full: '9999px',
    },

    breakpoints: {
        mobile: '640px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        glow: '0px 0px 180px 0px #9917FF',
        inner: 'inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4), inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2)',
    },

    transitions: {
        fast: '150ms ease-in-out',
        normal: '300ms ease-in-out',
        slow: '450ms ease-in-out',
        verySlow: '800ms ease',
    },
};

export type Theme = typeof theme;

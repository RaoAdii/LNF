export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'bg-base': '#f8f7f4',
        'bg-surface': '#ffffff',
        'bg-elevated': 'rgba(255,255,255,0.75)',
        'ink-primary': '#0f0f12',
        'ink-secondary': '#4a4a55',
        'ink-muted': '#9090a0',
        accent: '#2563eb',
        'accent-soft': 'rgba(37,99,235,0.08)',
        'lost-color': '#ef4444',
        'found-color': '#22c55e',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '22px',
        xl: '32px',
      },
      boxShadow: {
        'shadow-sm': '0 2px 12px rgba(0,0,0,0.06)',
        'shadow-md': '0 8px 40px rgba(0,0,0,0.10)',
        'shadow-lg': '0 24px 80px rgba(0,0,0,0.14)',
        'glass': '0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
      },
      spacing: {
        '18': '4.5rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        'pulse-soft': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(239,68,68,0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        shake: 'shake 0.4s ease-in-out',
        'pulse-soft': 'pulse-soft 2s infinite',
      },
    },
  },
  plugins: [],
}

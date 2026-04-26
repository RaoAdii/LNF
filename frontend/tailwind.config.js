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
        'bg-base': '#090814',
        'bg-surface': '#151225',
        'bg-elevated': 'rgba(27,23,48,0.92)',
        'ink-primary': '#ffffff',
        'ink-secondary': '#e6ebff',
        'ink-muted': '#b8c4ef',
        accent: '#8d7bff',
        'accent-soft': 'rgba(141,123,255,0.15)',
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
        'shadow-sm': '0 2px 12px rgba(0,0,0,0.25)',
        'shadow-md': '0 8px 40px rgba(0,0,0,0.35)',
        'shadow-lg': '0 24px 80px rgba(0,0,0,0.45)',
        'glass': '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
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

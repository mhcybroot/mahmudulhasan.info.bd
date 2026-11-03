/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          lowest: 'var(--bg-lowest)',
          border: 'var(--border-subtle)',
          'border-strong': 'var(--border-strong)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent-primary)',
          secondaryAccent: 'var(--accent-secondary)',
          glow: 'var(--accent-glow)',
          badge: 'var(--badge-bg)',
          bar: 'var(--terminal-bar)',
        },
        obsidian: {
          950: '#05080f',
          900: '#090d16',
          850: '#0c111d',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          accent: '#38bdf8',
          glow: '#22d3ee',
        },
        emerald: {
          DEFAULT: '#10b981',
          accent: '#34d399',
          glow: '#059669',
        },
        slate: {
          light: '#f8fafc',
          muted: '#94a3b8',
          dim: '#64748b',
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter Variable'", 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-hero': ['64px', { lineHeight: '72px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-hero-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.025em', fontWeight: '700' }],
        'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '20px', letterSpacing: '0.005em', fontWeight: '400' }],
        'label-mono-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-mono-md': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
        'label-mono-xs': ['10px', { lineHeight: '14px', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      spacing: {
        'gutter-sm': '1rem',
        'margin': '2rem',
        'margin-lg': '4rem',
        'margin-sm': '1rem',
        'space-xl': '2.5rem',
        'space-lg': '1.5rem',
        'space-xs': '0.25rem',
        'gutter': '1.5rem',
        'space-sm': '0.5rem',
        'gutter-lg': '2rem',
        'space-md': '1rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'terminal-cursor': 'blink 1s step-start infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};

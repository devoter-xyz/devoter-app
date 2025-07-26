import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        'gradient-1': '#F4A261',
        'gradient-2': '#E76F51',
        'gradient-3': '#2A9D8F',
        'gradient-4': '#264653',
        'brand-purple': '#6B46C1',
        'brand-orange': '#F56565',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace']
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '.border-gradient-gold': {
          border: '2px solid transparent',
          background: `linear-gradient(${theme('colors.background')}, ${theme('colors.background')}) padding-box, linear-gradient(to right, #FFD700, #FDB813) border-box`,
        },
        '.border-gradient-silver': {
          border: '2px solid transparent',
          background: `linear-gradient(${theme('colors.background')}, ${theme('colors.background')}) padding-box, linear-gradient(to right, #C0C0C0, #A9A9A9) border-box`,
        },
        '.border-gradient-bronze': {
          border: '2px solid transparent',
          background: `linear-gradient(${theme('colors.background')}, ${theme('colors.background')}) padding-box, linear-gradient(to right, #CD7F32, #A0522D) border-box`,
        },
        '.border-gradient-featured': {
          border: '2px solid transparent',
          background: `linear-gradient(${theme('colors.background')}, ${theme('colors.background')}) padding-box, linear-gradient(to right, #E76F51, #F4A261) border-box`,
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;

export default config;

import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'app-bg-primary': 'var(--color-bg-primary)',
        'app-bg-secondary': 'var(--color-bg-secondary)',
        'app-bg-tertiary': 'var(--color-bg-tertiary)',
        'app-bg-card': 'var(--color-bg-card)',
        'app-text-primary': 'var(--color-text-primary)',
        'app-text-secondary': 'var(--color-text-secondary)',
        'app-text-tertiary': 'var(--color-text-tertiary)',
        'app-border': 'var(--color-border)',
        'app-accent': 'var(--color-accent)',
        'app-tag-bg': 'var(--color-tag-bg)',
        'app-tag-text': 'var(--color-tag-text)',
      },
      maxWidth: {
        app: '480px',
        desktop: '1200px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

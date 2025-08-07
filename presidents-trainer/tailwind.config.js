import daisyui from 'daisyui';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        parchment: 'radial-gradient(ellipse at center, rgba(255,243,219,1) 0%, rgba(245,230,200,1) 100%)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        patriotic: {
          primary: '#1f3a8a',
          secondary: '#be123c',
          accent: '#f59e0b',
          neutral: '#1f2937',
          'base-100': '#0b1220',
          info: '#38bdf8',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
      'emerald',
      'cupcake',
    ],
  },
};
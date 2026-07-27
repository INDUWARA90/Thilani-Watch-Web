/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        surface: '#1a1a1a',
        border: 'rgba(255,255,255,0.12)',
        muted: '#888888',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255,255,255,0.25)',
        glowSm: '0 0 15px rgba(255,255,255,0.15)',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

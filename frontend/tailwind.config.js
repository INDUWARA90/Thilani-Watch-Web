/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        base: '#EAECF0',
        surface: '#EAECF0',
        card: '#F8FAFC',
        accent: '#F5C518',
        border: 'rgba(0,0,0,0.12)',
        muted: '#667085',
      },
      boxShadow: {
        premium: '0 22px 60px rgba(0,0,0,0.16)',
        premiumSm: '0 10px 28px rgba(0,0,0,0.10)',
        luxe: '0 30px 80px rgba(0,0,0,0.24)',
        imageLift: '0 26px 52px rgba(0,0,0,0.22)',
        goldHairline: '0 0 0 1px rgba(245,197,24,0.18), 0 18px 45px rgba(0,0,0,0.14)',
      },
      borderRadius: {
        luxe: '0.5rem',
        control: '999px',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        luxe: '250ms',
      },
    },
  },
  plugins: [],
}

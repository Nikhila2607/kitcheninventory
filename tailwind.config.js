/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'culinary': {
          50: '#fafdf7',
          100: '#f0fae8',
          200: '#e1f5d1',
          300: '#c7ebac',
          400: '#a3d87d',
          500: '#7fc050',
          600: '#63a339',
          700: '#4d802d',
          800: '#426a28',
          900: '#385723',
          950: '#1a2f0f',
        },
        'spice': {
          50: '#fefbe8',
          100: '#fff8c2',
          200: '#ffef88',
          300: '#ffe144',
          400: '#fed011',
          500: '#edb707',
          600: '#cc8a03',
          700: '#a36206',
          800: '#874c0c',
          900: '#723e0f',
          950: '#421f05',
        },
        'herb': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      backgroundImage: {
        'culinary-pattern': "url('https://images.pexels.com/photos/616484/pexels-photo-616484.jpeg')",
      }
    },
  },
  plugins: [],
};
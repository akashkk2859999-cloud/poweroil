import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2D8B2D',
          'green-dark': '#1A5C1A',
          'green-mid': '#236B23',
          'green-light': '#3DAF3D',
          'green-pale': '#E8F5E9',
          yellow: '#FFD100',
          'yellow-dark': '#E6BC00',
          'yellow-light': '#FFE957',
          'yellow-pale': '#FFFDE7',
          black: '#1A1A1A',
          dark: '#0D2B0D',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-green': 'radial-gradient(ellipse at 60% 40%, #3DAF3D 0%, #2D8B2D 40%, #1A5C1A 100%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'green-lg': '0 10px 40px -10px rgba(45,139,45,0.5)',
        'yellow-lg': '0 10px 40px -10px rgba(255,209,0,0.5)',
      },
    },
  },
  plugins: [],
};

export default config;

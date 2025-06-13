/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',      // Saddle Brown
        secondary: '#D2691E',    // Chocolate  
        accent: '#FF6B35',       // Burnt Orange
        surface: '#FFF8F3',      // Antique White
        background: '#FAF6F2',   // Linen
        success: '#22C55E',
        warning: '#F59E0B', 
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif']
      },
      fontSize: {
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px
        'base': '1rem',      // 16px
        'lg': '1.25rem',     // 20px
        'xl': '1.5rem',      // 24px
        '2xl': '1.875rem',   // 30px
        '3xl': '2.25rem',    // 36px
        '4xl': '3rem',       // 48px
      },
      animation: {
        'confetti': 'confetti 0.8s ease-out',
        'price-drop': 'pricedown 0.6s ease-out',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
        },
        pricedown: {
          '0%': { transform: 'translateY(-10px)', color: '#22C55E' },
          '100%': { transform: 'translateY(0)', color: '#inherit' }
        }
      }
    },
  },
  plugins: [],
}
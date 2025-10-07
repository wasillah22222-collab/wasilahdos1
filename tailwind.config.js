/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Logo Navy Colors
        'logo-navy': '#2C3E50',
        'logo-navy-light': '#34495E',
        'logo-navy-dark': '#1A252F',
        'logo-teal': '#16A085',
        'logo-teal-light': '#48C9B0',
        
        // Vibrant Accent Colors
        'vibrant-orange': '#E67E22',
        'vibrant-orange-light': '#F39C12',
        'vibrant-orange-dark': '#D35400',
        
        // Elegant Neutrals
        'cream-elegant': '#F8F6F0',
        'cream-white': '#FEFEFE',
        'gold-luxury': '#D4AF37',
        'gold-light': '#F1C40F',
        
        // Readable Text Colors
        'text-dark': '#1A1A1A',
        'text-medium': '#2C2C2C',
        'text-light': '#4A4A4A',
      },
      fontFamily: {
        'luxury-display': ['Playfair Display', 'serif'],
        'luxury-heading': ['Poppins', 'sans-serif'],
        'luxury-body': ['Inter', 'sans-serif'],
        'luxury-medium': ['Inter', 'sans-serif'],
        'arabic': ['Amiri', 'serif'],
      },
      animation: {
        'cinematic-fade': 'cinematic-fade-in 1.2s ease-out forwards',
        'text-shimmer': 'text-shimmer 3s linear infinite',
        'counter': 'counter-up 0.8s ease-out forwards',
        'parallax-float': 'parallax-float 8s ease-in-out infinite',
        'luxury-glow': 'luxury-glow 4s ease-in-out infinite',
        'wave': 'wave-motion 6s ease-in-out infinite',
        'particle-drift': 'particle-drift 5s ease-in-out infinite',
        'slide-up-luxury': 'slide-up-luxury 1s ease-out forwards',
        'fade-in-luxury': 'fade-in-luxury 0.8s ease-out forwards',
      },
      boxShadow: {
        'luxury': '0 25px 50px rgba(44, 62, 80, 0.15)',
        'luxury-lg': '0 40px 80px rgba(44, 62, 80, 0.25)',
        'luxury-glow': '0 0 30px rgba(230, 126, 34, 0.4)',
        'luxury-glow-lg': '0 0 50px rgba(230, 126, 34, 0.6)',
      },
      borderRadius: {
        'luxury': '20px',
        'luxury-lg': '28px',
      },
      backdropBlur: {
        'luxury': '25px',
      },
    },
  },
  plugins: [],
};
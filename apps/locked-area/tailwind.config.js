/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Boost brand colors (keep these)
        'boost-navy': '#072D59',
        'boost-navy-light': '#0F2B42',
        'boost-gold': '#D4AF37',
        'boost-gold-light': '#e0bd4a',
        'boost-gold-dark': '#c9a227',
        'boost-cream': '#F5F0E6',
        'boost-red': '#C93320',
        'boost-red-bright': '#F04D38',
        'boost-red-light': '#FEF0ED',
        'boost-blue-light': '#C0C7DA',

        // DARK BLUE THEME - Matching login page exactly
        'surface': '#072D59',        // Main background = boost-navy (login page bg)
        'surface-dark': '#0a1f3d',   // Darker navy for depth
        'surface-card': '#0d2a4f',   // Slightly lighter navy for cards
        'surface-input': '#0e2d55',  // Input fields
        'text': '#F5F0E6',           // Primary text = boost-cream (warm white)
        'text-secondary': '#C0C7DA', // Secondary text = boost-blue-light
        'text-muted': '#8a9bb8',     // Muted text
        'accent': '#D4AF37',         // Accent = boost-gold (matches login page gold)
        'accent-hover': '#e0bd4a',   // Gold hover = boost-gold-light
        'border': '#1a4a7a',         // Subtle navy borders
        'border-light': '#2a5a8a',   // Lighter borders
        'success': '#22c55e',        // Green
        'error': '#C93320',          // Red = boost-red
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      maxWidth: {
        'container': '1280px',
      },
      borderRadius: {
        'card': '0.75rem',
        'input': '0.75rem',
        'pill': '1.5rem',
        'cta': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
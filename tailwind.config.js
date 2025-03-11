/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        display: ["Cinzel", "serif"],
      },
      colors: {
        jewelry: {
          50: "#FFF5F7",
          100: "#FFEAEF",
          200: "#FFCCD6",
          300: "#FFB3C1",
          400: "#FF8095",
          500: "#FF4D6A",
          600: "#E6455F",
          700: "#BF3A4F",
          800: "#992E3F",
          900: "#7D2534",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        pearl: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};

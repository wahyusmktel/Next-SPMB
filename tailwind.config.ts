import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#296374",
          50: "#e6f0f3",
          100: "#cce1e7",
          200: "#99c3cf",
          300: "#66a5b7",
          400: "#33879f",
          500: "#296374",
          600: "#214f5c",
          700: "#193b45",
          800: "#10272e",
          900: "#081317",
        },
        secondary: {
          DEFAULT: "#629FAD",
          50: "#f0f7f9",
          100: "#e1eff2",
          200: "#c3dfe5",
          300: "#a5cfd8",
          400: "#87bfcb",
          500: "#629FAD",
          600: "#4e7f8a",
          700: "#3b5f68",
          800: "#273f45",
          900: "#142023",
        },
        tertiary: {
          DEFAULT: "#233D4D",
          50: "#e8ecee",
          100: "#d1d9dd",
          200: "#a3b3bb",
          300: "#768d99",
          400: "#486777",
          500: "#233D4D",
          600: "#1c313e",
          700: "#15252e",
          800: "#0e181f",
          900: "#070c0f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #296374 0%, #629FAD 100%)",
        "gradient-dark": "linear-gradient(135deg, #233D4D 0%, #296374 100%)",
        "gradient-radial": "radial-gradient(circle at center, #629FAD 0%, #296374 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "bounce-soft": "bounceSoft 2s infinite",
        "pulse-soft": "pulseSoft 2s infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

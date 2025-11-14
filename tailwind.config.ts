import type {Config} from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "line-reveal": {
          "0%": { transform: "translateY(110%)" },
          "100%": { transform: "translateY(0)" },
        },
        "page-wipe-in": {
          "from": { transform: "translateX(-101%)" },
          "to": { transform: "translateX(0)" },
        },
        "page-wipe-out": {
          "from": { transform: "translateX(0)" },
          "to": { transform: "translateX(101%)" },
        },
        "infinite-scroll": {
          "from": { transform: "translateX(0)" },
          "to": { transform: "translateX(-100%)" },
        },
        "fade-in": {
          "from": { opacity: "0" },
          "to": { opacity: "1" },
        },
        square1: {
          "0%": { left: "calc(0 * var(--offset))", top: "calc(0 * var(--offset))" },
          "8.333%": { left: "calc(0 * var(--offset))", top: "calc(1 * var(--offset))" },
          "100%": { left: "calc(0 * var(--offset))", top: "calc(1 * var(--offset))" },
        },
        square2: {
          "0%": { left: "calc(0 * var(--offset))", top: "calc(1 * var(--offset))" },
          "8.333%": { left: "calc(0 * var(--offset))", top: "calc(2 * var(--offset))" },
          "16.67%": { left: "calc(1 * var(--offset))", top: "calc(2 * var(--offset))" },
          "25.00%": { left: "calc(1 * var(--offset))", top: "calc(1 * var(--offset))" },
          "83.33%": { left: "calc(1 * var(--offset))", top: "calc(1 * var(--offset))" },
          "91.67%": { left: "calc(1 * var(--offset))", top: "calc(0 * var(--offset))" },
          "100%": { left: "calc(0 * var(--offset))", top: "calc(0 * var(--offset))" },
        },
        square3: {
          "0%,100%": { left: "calc(1 * var(--offset))", top: "calc(1 * var(--offset))" },
          "16.67%": { left: "calc(1 * var(--offset))", top: "calc(1 * var(--offset))" },
          "25.00%": { left: "calc(1 * var(--offset))", top: "calc(0 * var(--offset))" },
          "33.33%": { left: "calc(2 * var(--offset))", top: "calc(0 * var(--offset))" },
          "41.67%": { left: "calc(2 * var(--offset))", top: "calc(1 * var(--offset))" },
          "66.67%": { left: "calc(2 * var(--offset))", top: "calc(1 * var(--offset))" },
          "75.00%": { left: "calc(2 * var(--offset))", top: "calc(2 * var(--offset))" },
          "83.33%": { left: "calc(1 * var(--offset))", top: "calc(2 * var(--offset))" },
          "91.67%": { left: "calc(1 * var(--offset))", top: "calc(1 * var(--offset))" },
        },
        square4: {
          "0%": { left: "calc(2 * var(--offset))", top: "calc(1 * var(--offset))" },
          "33.33%": { left: "calc(2 * var(--offset))", top: "calc(1 * var(--offset))" },
          "41.67%": { left: "calc(2 * var(--offset))", top: "calc(2 * var(--offset))" },
          "50.00%": { left: "calc(3 * var(--offset))", top: "calc(2 * var(--offset))" },
          "58.33%": { left: "calc(3 * var(--offset))", top: "calc(1 * var(--offset))" },
          "100%": { left: "calc(3 * var(--offset))", top: "calc(1 * var(--offset))" },
        },
        square5: {
          "0%": { left: "calc(3 * var(--offset))", top: "calc(1 * var(--offset))" },
          "50.00%": { left: "calc(3 * var(--offset))", top: "calc(1 * var(--offset))" },
          "58.33%": { left: "calc(3 * var(--offset))", top: "calc(0 * var(--offset))" },
          "66.67%": { left: "calc(2 * var(--offset))", top: "calc(0 * var(--offset))" },
          "75.00%": { left: "calc(2 * var(--offset))", top: "calc(1 * var(--offset))" },
          "100%": { left: "calc(2 * var(--offset))", top: "calc(1 * var(--offset))" },
        },
        squarefadein: {
          "0%": { transform: "scale(0.75)", opacity: "0.0" },
          "100%": { transform: "scale(1.0)", opacity: "1.0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "line-reveal": "line-reveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "page-wipe-in": "page-wipe-in 400ms ease-in-out forwards",
        "page-wipe-out": "page-wipe-out 400ms ease-in-out forwards",
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        "fade-in": "fade-in 300ms ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

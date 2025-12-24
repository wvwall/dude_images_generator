/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "friends-purple": "#5D3F6A",
        "friends-yellow": "#F4C430",
        "friends-red": "#E74C3C",
        "friends-blue": "#3498DB",
        "friends-purple-light": "#d1caf1",
        "friends-yellow-light": "#fff5cc",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ['"Poppins"', "sans-serif"],
        hand: ['"Permanent Marker"', "cursive"],
      },
    },
  },
  plugins: [],
};

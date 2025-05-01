/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        sidebar: "#090F13",
        background: "#3D606E",
        header: "#153B47",
        text: "#3D606E",

        green_bg: "#2D6A4F",
        red_bg: "#B33A3A",
        yellow_bg: "#B59F3B",
        blue_bg: "#2A4E6C",
        purple_bg: "#5A4E8C",
        pink_bg: "#A45D7A",



      },
    },
  },
  plugins: [],
};

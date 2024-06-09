import("tailwindcss");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F3F3F3",
        secondary: "#FFFFFF",
        primary_font: "#000000c2",
      },
      fontFamily: {
        primary: ["Radio Canada", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        foreground: "var(--foreground)",
        background: "var(--background)",
        green: {
          50: "#e6f9f0",
          100: "#ccf2e1",
          200: "#99e6c3",
          300: "#66dba4",
          400: "#33cf86",
          500: "#00AB55", // custom hijau kamu
          600: "#008944",
          700: "#006633",
          800: "#004422",
          900: "#002211",
          950: "#00110A",
        },
        // Tambahkan lainnya sesuai kebutuhan
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addVariant }) => {
      addVariant("dark", "&:is(.dark *)"); // custom variant dari global.css kamu
    }),
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a56db",
        success: "#0e9f6e",
        warning: "#faca15",
        danger: "#f05252",
        neutral: "#6b7280",
        background: "#f5f7fa",
      },
    },
  },
  plugins: [],
};

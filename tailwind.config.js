/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

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
  plugins: [daisyui],

  // (opsional tapi direkomendasikan)
  daisyui: {
    themes: [
      {
        efilling: {
          primary: "#1a56db",
          success: "#0e9f6e",
          warning: "#faca15",
          error: "#f05252",
          neutral: "#6b7280",
          "base-100": "#ffffff",
          "base-200": "#f5f7fa",
          "base-300": "#e5e7eb",
        },
      },
      "light",
      "dark",
    ],
  },
};

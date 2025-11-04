/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4500",
        secondary: "#0079D3",
        accent: "#46D160",
        surface: "#FFFFFF",
        background: "#DAE0E6",
        upvote: "#FF4500",
        downvote: "#0079D3",
        success: "#46D160",
        warning: "#FFB000",
        error: "#EA0027",
        info: "#0079D3",
      },
      fontFamily: {
        'display': ['IBM Plex Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
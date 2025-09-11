/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#4A69FF',
        'brand-orange': '#F58A2B',
        'brand-background': '#F0F2F5',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        'success': '#2ECC71',
      },
    },
  },
  plugins: [],
}


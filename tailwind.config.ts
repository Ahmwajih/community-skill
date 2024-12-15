// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./app/(public)/**/*.{js,ts,jsx,tsx}", 
    "./app/(private)/**/*.{js,ts,jsx,tsx}", 
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#9cded9',
        'beige': '#b6a99c',
        'brown': '#3c1e06',
        'light-green': '#66aaa3', 
        'blue': '#618eca',
        'orange': '#fe972f',
        'white': '#ffffff',
        'black': '#1D1309',
        'gray': '#666666'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'lora': ['Lora', 'serif'],
        // 'dancing': ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [require('daisyui')],
};

export default config;

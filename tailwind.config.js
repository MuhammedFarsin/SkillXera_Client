// tailwind.config.js
export default {
    content: [
      "./src/**/*.{html,js,jsx,tsx}",  // Make sure all source files are covered
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    safelist: [
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-6xl',
      'lg:text-sm', 'lg:text-base', 'lg:text-lg', 'lg:text-xl', 'lg:text-2xl', 'lg:text-3xl', 'lg:text-4xl', 'lg:text-6xl'
    ],
    
  }
  
  
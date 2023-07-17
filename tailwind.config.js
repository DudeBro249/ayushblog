module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'main_black': '#212121',
          'darker': '#121212',
        },
        fontFamily: {
          'inter': ['Inter', 'sans-serif']
        },
        
      }
    },
    plugins: [
      require('@tailwindcss/typography')
    ],
}

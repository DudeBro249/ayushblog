module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'main_black': '#212121',
          'darker': '#121212',
          'admonition_info': '#54C7EC',
          'admonition_caution': '#F6BB41',
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

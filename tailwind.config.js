module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{md,html,vue}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

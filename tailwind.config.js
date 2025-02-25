module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
        'grey-dark': "var(--color-grey-dark)",
        'grey-light': "var(--color-grey-light)",
        primary: "var(--color-primary)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

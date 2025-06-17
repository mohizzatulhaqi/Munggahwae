module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        global: {
          background1: "var(--global-bg-1)",
          background2: "var(--global-bg-2)",
          background3: "var(--global-bg-3)",
          text1: "var(--global-text-1)",
          text2: "var(--global-text-2)",
          text3: "var(--global-text-3)",
          text4: "var(--global-text-4)"
        },
        chipview: {
          background1: "var(--chipview-bg-1)"
        },
        border: {
          primary: "var(--border-primary)"
        }
      },
      fontFamily: {
        'plus-jakarta': ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
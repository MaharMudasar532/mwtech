import colors from './theme/colors.js'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        mw: {
          primary: colors.mw.primary,
          secondary: colors.mw.secondary,
          accent: colors.mw.accent,
          background: colors.mw.background,
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(22,44,68,0.08)',
      },
    },
  },
  plugins: [],
}

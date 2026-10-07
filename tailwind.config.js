const { colors } = require('./theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        surface: {
          DEFAULT: colors.surface,
          soft: colors.surfaceSoft,
        },
        border: colors.border,
        ink: {
          DEFAULT: colors.textPrimary,
          secondary: colors.textSecondary,
          muted: colors.textMuted,
        },
        primary: {
          DEFAULT: colors.primary,
          dark: colors.primaryDark,
          soft: colors.primarySoft,
        },
        danger: {
          DEFAULT: colors.danger,
          soft: colors.dangerSoft,
        },
        success: colors.success,
      },
      fontSize: {
        title: ['22px', { lineHeight: '28px' }],
        headline: ['20px', { lineHeight: '26px' }],
        section: ['17px', { lineHeight: '22px' }],
        label: ['15px', { lineHeight: '20px' }],
        body: ['14px', { lineHeight: '20px' }],
        caption: ['13px', { lineHeight: '18px' }],
        meta: ['12px', { lineHeight: '16px' }],
      },
    },
  },
  plugins: [],
};

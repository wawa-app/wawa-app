/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      //Typography
      fontFamily: {
        geologica: ['Geologica-Regular'],          // 400
        'geologica-medium': ['Geologica-Medium'],  // 500
        'geologica-bold': ['Geologica-Bold'],      // 700
        'geologica-black': ['Geologica-Black'],    // 900
      },
      fontSize: {
        'display-medium': ['40px', { lineHeight: '48px' }],  // font-geologica-black
        'display-small': ['36px', { lineHeight: '44px' }],  // font-geologica-bold
        'headline-large': ['32px', { lineHeight: '40px' }],  // font-geologica-bold
        'headline-small': ['24px', { lineHeight: '32px' }],  // font-geologica-bold
        'title-large': ['20px', { lineHeight: '28px' }],  // font-geologica-bold
        'body-large': ['16px', { lineHeight: '24px' }],  // font-geologica
        'body-medium': ['14px', { lineHeight: '20px' }],  // font-geologica
        'label-large': ['14px', { lineHeight: '20px' }],  // font-geologica-medium
        'label-medium': ['12px', { lineHeight: '16px', letterSpacing: '0.06px' }], // font-geologica-medium
        'label-small': ['11px', { lineHeight: '16px' }],  // font-geologica
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Typography
      fontFamily: {
        geologica: ['Geologica-Regular'],          // 400
        'geologica-medium': ['Geologica-Medium'],  // 500
        'geologica-bold': ['Geologica-Bold'],      // 700
        'geologica-black': ['Geologica-Black'],    // 900
      },
      fontSize: {
        'display-medium': ['40px', { lineHeight: '48px' }],  // font-geologica-black
        'display-small': ['36px', { lineHeight: '44px' }],   // font-geologica-bold
        'headline-large': ['32px', { lineHeight: '40px' }],  // font-geologica-bold
        'headline-small': ['24px', { lineHeight: '32px' }],  // font-geologica-bold
        'title-large': ['20px', { lineHeight: '28px' }],     // font-geologica-bold
        'body-large': ['16px', { lineHeight: '24px' }],      // font-geologica
        'body-medium': ['14px', { lineHeight: '20px' }],     // font-geologica
        'label-large': ['14px', { lineHeight: '20px' }],     // font-geologica-medium
        'label-medium': ['12px', { lineHeight: '16px', letterSpacing: '0.06px' }], // font-geologica-medium
        'label-small': ['11px', { lineHeight: '16px' }],     // font-geologica
      },

      // Colour - Mode 1
      colors: {
        "Uni-50": "#FFF3E0FF",
        "Uni-100": "#FFE0B2FF",
        "Uni-200": "#FFCC80FF",
        "Uni-300": "#FFB24DFF",
        "Uni-400": "#FFA026FF",
        "Uni-500": "#FF8400FF",
        "Uni-600": "#FF6D00FF",
        "Uni-700": "#E65B00FF",
        "Uni-800": "#CC4C00FF",
        "Uni-900": "#B33E00FF",
        "Uni-950": "#8C2E00FF",

        "Sunlight-50": "#FFFDE7FF",
        "Sunlight-100": "#FFF9C4FF",
        "Sunlight-200": "#FFF59DFF",
        "Sunlight-300": "#FFE082FF",
        "Sunlight-400": "#FFD54FFF",
        "Sunlight-500": "#FFCA28FF",
        "Sunlight-600": "#FFC414FF",
        "Sunlight-700": "#FFC107FF",
        "Sunlight-800": "#FFA000FF",
        "Sunlight-900": "#FF8F00FF",
        "Sunlight-950": "#E67A00FF",

        "State-Error": "#FF3D00FF",
        "State-Warn": "#FF9800FF",
        "State-Success": "#4CAF50FF",
        "State-Disable": "#757575FF",
        "State-Info": "#0277BDFF",

        "Neutral-brandWarm-50": "#FFFBF0FF",
        "Neutral-brandWarm-100": "#FFF8E1FF",
        "Neutral-brandWarm-200": "#FFF3CDFF",
        "Neutral-brandWarm-950": "#1A0F07FF",
        "Neutral-brandWarm-800": "#3D2A1CFF",

        "Neutral-Gray-200": "#F5F2EBFF",
        "Neutral-Gray-300": "#EAE4D9FF",
        "Neutral-Gray-400": "#D4CBBFFF",
        "Neutral-Gray-500": "#A29789FF",

        "Neutral-brandWarm-900-38": "#261C1461",

        "Base-Background": "#FFFBF0FF",
        "Base-Surface": "#FFF8E1FF",
        "Base-Paper": "#FFF3CDFF",
        "Base-Surface-Variant": "#FFF3CDFF",
        "Base-OnBackground": "#1A0F07FF",
        "Base-OnSurface": "#1A0F07FF",
        "Base-OnPaper": "#3D2A1CFF",
        "Base-OnPrimary": "#1A0F07FF",
        "Base-OnSecondary": "#1A0F07FF",

        "Brand-Primary": "#FF6D00FF",
        "Brand-Secondary": "#FFC107FF",
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Typography
      fontFamily: {
        geologica: ['Geologica-Regular'],          // 400
        'geologica-light': ['Geologica-Light'],    // 300
        'geologica-medium': ['Geologica-Medium'],  // 500
        'geologica-bold': ['Geologica-Bold'],      // 700
        'geologica-black': ['Geologica-Black'],    // 900
      },
      fontSize: {
        'display-extra-large': ['96px', { lineHeight: '108px', letterSpacing: '0.25px' }], // font-geologica-black
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
        "Uni-50": "#FFF3E0",
        "Uni-100": "#FFE0B2",
        "Uni-200": "#FFCC80",
        "Uni-300": "#FFB24D",
        "Uni-400": "#FFA026",
        "Uni-500": "#FF8400",
        "Uni-600": "#FF6D00",
        "Uni-700": "#E65B00",
        "Uni-800": "#CC4C00",
        "Uni-900": "#B33E00",
        "Uni-950": "#8C2E00",

        "Sunlight-50": "#FFFDE7",
        "Sunlight-100": "#FFF9C4",
        "Sunlight-200": "#FFF59D",
        "Sunlight-300": "#FFE082",
        "Sunlight-400": "#FFD54F",
        "Sunlight-500": "#FFCA28",
        "Sunlight-600": "#FFC414",
        "Sunlight-700": "#FFC107",
        "Sunlight-800": "#FFA000",
        "Sunlight-900": "#FF8F00",
        "Sunlight-950": "#E67A00",

        "State-Error": "#FF3D00",
        "State-Warn": "#FF9800",
        "State-Success": "#4CAF50",
        "State-Disable": "#757575",
        "State-Info": "#0277BD",

        "Neutral-brandWarm-50": "#FFFBF0",
        "Neutral-brandWarm-100": "#FFF8E1",
        "Neutral-brandWarm-200": "#FFF3CD",
        "Neutral-brandWarm-950": "#1A0F07",
        "Neutral-brandWarm-800": "#3D2A1C",

        "Neutral-Gray-200": "#F5F2EB",
        "Neutral-Gray-300": "#EAE4D9",
        "Neutral-Gray-400": "#D4CBBF",
        "Neutral-Gray-500": "#A29789",

        "Neutral-brandWarm-900-38": "#261C1461",

        "Base-Background": "#FFFBF0",
        "Base-Surface": "#FFF8E1",
        "Base-Paper": "#FFF3CD",
        "Base-Surface-Variant": "#FFF3CD",
        "Base-OnBackground": "#1A0F07",
        "Base-OnSurface": "#1A0F07",
        "Base-OnPaper": "#3D2A1C",
        "Base-OnPrimary": "#1A0F07",
        "Base-OnSecondary": "#1A0F07",

        "Brand-Primary": "#FF6D00",
        "Brand-Secondary": "#FFC107",
      },
      //Spacing
      spacing: {
        "Space-spacing-xs": "4px",
        "Space-spacing-sm": "8px",
        "Space-spacing-md": "12px",
        "Space-spacing-lg": "16px",
        "Space-spacing-xl": "24px",
        "Space-spacing-xxl": "32px",
        "Space-spacing-3xl": "48px",
        "Size-size-icon-sm": "16px",
        "Size-size-icon-md": "24px",
        "Size-size-clickable-min": "48px",
        "Size-size-button-target": "56px",
      },
      //Border radius
      borderRadius: {
        "Radius-radius-none": "0px",
        "Radius-radius-xs": "4px",
        "Radius-radius-sm": "8px",
        "Radius-radius-md": "12px",
        "Radius-radius-lg": "16px",
        "Radius-radius-xl": "28px",
        "Radius-radius-full": "9999px",
      },
    },
  },
  plugins: [],
};
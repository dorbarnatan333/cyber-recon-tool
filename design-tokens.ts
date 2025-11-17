/**
 * Design System Tokens
 * Extracted from Figma Web Design System
 * Adapted for Cyber Security Operations Interface
 */

export const designTokens = {
  // TYPOGRAPHY
  fonts: {
    heading: ['Poppins', 'system-ui', 'sans-serif'],
    body: ['DM Sans', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'], // For code/data display
  },

  fontSize: {
    'giant': '44px',
    'h1': '32px',
    'h2': '28px', 
    'h3': '24px',
    'h4': '20px',
    'h5': '16px',
    'h6': '14px',
    'subheading': '12px',
    'subheading-lg': '14px',
    'body-lg': '18px',
    'body': '16px',
    'body-bold': '16px',
    'body-sm': '14px',
    'caption': '12px',
    'button-lg': '16px',
    'button-sm': '14px',
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    'giant': '66px',
    'h1': '32px',
    'h2': '32px',
    'h3': '32px', 
    'h4': '28px',
    'h5': '24px',
    'h6': '22px',
    'subheading': '16px',
    'subheading-lg': '20px',
    'body-lg': '26px',
    'body': '24px',
    'body-bold': '24px',
    'body-sm': '20px',
    'caption': '16px',
    'button-lg': '24px',
    'button-sm': '22px',
  },

  // COLORS - Original palette adapted for cyber security context
  colors: {
    // Primary colors - adapted Main teal for cyber theme
    primary: {
      950: '#044240', // Darkest - for deep backgrounds
      900: '#09918D', // Main Dark - primary dark
      800: '#0B85B0', // Main - primary
      700: '#30C0BC', // Main 85 - primary light
      600: '#60CFCC', // Main 65
      500: '#85DAD8', // Main 50
      400: '#AAE5E3', // Main 35
      300: '#C2EDEB', // Main 25
      200: '#DAF4F3', // Main 15
      100: '#E7F8F7', // Main 10
      50: '#F3FBFB',  // Main 5
    },

    // Grays - essential for dark themes
    gray: {
      950: '#0A0B0A', // Deeper than original for true dark mode
      900: '#191E1C', // Dark Gray
      800: '#484F4C', // Gray 85
      700: '#737877', // Gray 65  
      600: '#949796', // Gray 50
      500: '#B4B6B6', // Gray 35
      400: '#C9CBCA', // Gray 25
      300: '#DFEDF0', // Gray 15
      200: '#EEEFEF', // Gray 10
      100: '#FBFBFB', // Gray 2
      50: '#FFFFFF',  // White
    },

    // Status colors - critical for security interfaces
    success: {
      900: '#1a5f37', // Darker for contrast
      800: '#258750', // Success Green
      200: '#CDF1D8', // Success Green 25
      50: '#f0f9f3',  // Very light success
    },

    danger: {
      900: '#8b1000', // Darker red for high contrast
      800: '#B61400', // Danger dark
      700: '#E11900', // Danger
      200: '#F9C8BF', // Danger 25  
      50: '#fdf2f0',  // Very light danger
    },

    warning: {
      900: '#5d4718', // Darker amber
      800: '#7D5E21', // Warning dark
      700: '#FF9043', // Warning
      200: '#fef3cd', // Light warning
      50: '#fffdf0',  // Very light warning
    },

    // Cyber-specific color additions
    cyber: {
      matrix: '#00FF41', // Classic matrix green for active/scanning states
      neon: '#0FF0FC',   // Cyan neon for highlights  
      purple: '#8566DC', // From original purple
      orange: '#FF8600', // From original orange
      yellow: '#F6BB3D', // From original yellow
    },

    // Semantic color mapping for security contexts
    threat: {
      critical: '#B61400', // Danger dark
      high: '#E11900',     // Danger
      medium: '#FF9043',   // Warning
      low: '#F6BB3D',      // Yellow
      info: '#0A66C2',     // Indigo
      success: '#258750',  // Success
    },
  },

  // SPACING SYSTEM (8px base grid)
  spacing: {
    0: '0px',
    1: '4px',   // 0.25rem
    2: '8px',   // 0.5rem  
    3: '12px',  // 0.75rem
    4: '16px',  // 1rem
    5: '20px',  // 1.25rem
    6: '24px',  // 1.5rem
    8: '32px',  // 2rem
    10: '40px', // 2.5rem
    12: '48px', // 3rem
    16: '64px', // 4rem
    20: '80px', // 5rem
    24: '96px', // 6rem
  },

  // BORDER RADIUS
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',    // Buttons, tags
    lg: '12px',   // Select dropdowns
    xl: '16px',   // Modals  
    '2xl': '24px',
    full: '9999px',
  },

  // SHADOWS - for depth and elevation
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    // Cyber-specific glows
    glow: '0 0 20px rgba(0, 255, 65, 0.3)', // Matrix green glow
    'glow-cyan': '0 0 20px rgba(15, 240, 252, 0.3)', // Cyan glow
    'glow-danger': '0 0 20px rgba(225, 25, 0, 0.3)', // Red glow for threats
  },

  // COMPONENT SPECIFICATIONS
  components: {
    button: {
      borderRadius: '8px',
      sizes: {
        sm: { padding: '8px 12px', fontSize: '14px', lineHeight: '22px' },
        md: { padding: '12px 16px', fontSize: '16px', lineHeight: '24px' },
        lg: { padding: '16px 24px', fontSize: '16px', lineHeight: '24px' },
      }
    },
    
    tag: {
      borderRadius: '8px',
      sizes: {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '6px 12px', fontSize: '14px' },
        lg: { padding: '8px 16px', fontSize: '16px' },
      }
    },

    input: {
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '16px',
      lineHeight: '24px',
    },

    card: {
      borderRadius: '12px',
      padding: '24px',
    },

    modal: {
      borderRadius: '16px',
      padding: '32px',
    }
  },

  // BREAKPOINTS for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ANIMATION/TRANSITION values
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out', 
      'ease-in-out': 'ease-in-out',
    }
  }
} as const;

// Export individual token categories for easier imports
export const { fonts, fontSize, fontWeight, lineHeight, colors, spacing, borderRadius, boxShadow, components, breakpoints, animation } = designTokens;

// Type definitions for TypeScript
export type ColorScale = keyof typeof colors.gray;
export type SpacingScale = keyof typeof spacing;
export type FontSize = keyof typeof fontSize;
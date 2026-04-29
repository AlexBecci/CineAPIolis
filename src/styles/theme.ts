/**
 * Atmospheric Glass — Design Token Map
 * Fuente: DESIGN.md
 * Todos los valores mapean 1:1 con los tokens del sistema de diseño.
 */

export const theme = {
  colors: {
    // Surfaces
    surface: '#0b1326',
    surfaceDim: '#0b1326',
    surfaceBright: '#31394d',
    surfaceContainerLowest: '#060e20',
    surfaceContainerLow: '#131b2e',
    surfaceContainer: '#171f33',
    surfaceContainerHigh: '#222a3d',
    surfaceContainerHighest: '#2d3449',
    surfaceVariant: '#2d3449',
    surfaceTint: '#c6c6c7',

    // On-surface
    onSurface: '#dae2fd',
    onSurfaceVariant: '#c4c7c8',

    // Inverse
    inverseSurface: '#dae2fd',
    inverseOnSurface: '#283044',

    // Outline
    outline: '#8e9192',
    outlineVariant: '#444748',

    // Primary
    primary: '#ffffff',
    onPrimary: '#2f3131',
    primaryContainer: '#e2e2e2',
    onPrimaryContainer: '#636565',
    inversePrimary: '#5d5f5f',
    primaryFixed: '#e2e2e2',
    primaryFixedDim: '#c6c6c7',
    onPrimaryFixed: '#1a1c1c',
    onPrimaryFixedVariant: '#454747',

    // Secondary
    secondary: '#adc9eb',
    onSecondary: '#14324e',
    secondaryContainer: '#304b68',
    onSecondaryContainer: '#9fbbdd',
    secondaryFixed: '#d0e4ff',
    secondaryFixedDim: '#adc9eb',
    onSecondaryFixed: '#001d35',
    onSecondaryFixedVariant: '#2d4965',

    // Tertiary
    tertiary: '#ffffff',
    onTertiary: '#620040',
    tertiaryContainer: '#ffd8e7',
    onTertiaryContainer: '#ab3779',
    tertiaryFixed: '#ffd8e7',
    tertiaryFixedDim: '#ffafd3',
    onTertiaryFixed: '#3d0026',
    onTertiaryFixedVariant: '#85145a',

    // Error
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',

    // Background
    background: '#0b1326',
    onBackground: '#dae2fd',

    // Gradient canvas (Primary Canvas del design doc)
    gradientCanvas: 'linear-gradient(135deg, #1E3A8A 0%, #7E22CE 55%, #DB2777 100%)',
  },

  typography: {
    fontFamily: "'Inter', sans-serif",

    displayLg: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '84px',
      fontWeight: '700',
      lineHeight: '90px',
      letterSpacing: '-0.04em',
    },
    headlineLg: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
      letterSpacing: '-0.02em',
    },
    headlineMd: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '24px',
      fontWeight: '500',
      lineHeight: '32px',
    },
    bodyLg: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
    },
    bodyMd: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
    },
    labelSm: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '16px',
      letterSpacing: '0.05em',
    },
  },

  /**
   * "Weight Tier Up" — si el texto está sobre vidrio con blur,
   * el fontWeight sube un nivel para compensar la distorsión visual.
   * Tabla: 400 → 500, 500 → 600, 600 → 700, 700 → 800
   */
  weightTierUp: (weight: string | number): string => {
    const map: Record<string, string> = {
      '400': '500',
      '500': '600',
      '600': '700',
      '700': '800',
    };
    return map[String(weight)] ?? String(weight);
  },

  rounded: {
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },

  spacing: {
    unit: 8,           // 8px base grid
    containerPadding: 24,
    cardGap: 16,
    sectionMargin: 40,
    glassPadding: 20,
    /** Helper: multiplica el unit por n → retorna string con px */
    u: (n: number) => `${n * 8}px`,
  },

  glass: {
    /** Level 2 — Standard Card */
    standard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    },
    /** Level 3 — Elevated / Modals */
    elevated: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    },
  },

  button: {
    height: '48px',
    paddingX: '24px',
  },

  input: {
    height: '48px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

export type Theme = typeof theme;

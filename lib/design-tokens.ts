export const designTokens = {
  colors: {
    primary: '#0B6E4F',
    secondary: '#2563EB',
    action: '#F59E0B',
    bg: '#020617',
    surface: '#0F172A',
    surfaceAlt: '#13233F',
    text: '#E2E8F0',
    textStrong: '#F8FAFC',
    muted: '#94A3B8',
    success: '#10B981',
    error: '#F43F5E',
    ring: '#2DD4BF',
  },
  motion: {
    fast: '150ms',
    base: '220ms',
    slow: '300ms',
  },
  touch: {
    minTargetPx: 44,
    minGapPx: 8,
  },
} as const;

export type DesignTokens = typeof designTokens;

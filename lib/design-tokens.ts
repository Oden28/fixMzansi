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
    easing: {
      out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
  touch: {
    minTargetPx: 44,
    minGapPx: 8,
  },
  radius: {
    control: '12px',
    card: '16px',
    panel: '24px',
  },
} as const;

export type DesignTokens = typeof designTokens;

import { designTokens } from './design-tokens';

type MotionClass = 'micro' | 'small' | 'medium';
type ComponentClass = 'input' | 'select' | 'textarea' | 'button' | 'card';

export function getMotionPreset(kind: MotionClass): { durationMs: number; easing: string } {
  if (kind === 'micro') {
    return { durationMs: 150, easing: designTokens.motion.easing.out };
  }
  if (kind === 'small') {
    return { durationMs: 220, easing: designTokens.motion.easing.inOut };
  }
  return { durationMs: 300, easing: designTokens.motion.easing.out };
}

const inputBase = `touch-target w-full rounded-xl border px-4 py-3 outline-none transition-all duration-[${designTokens.motion.fast}]`;

const buttonBase = `touch-target inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-[${designTokens.motion.base}]`;

export function getComponentClasses(component: ComponentClass): string {
  if (component === 'input') return inputBase;
  if (component === 'select') return `${inputBase} appearance-none pr-10 cursor-pointer`;
  if (component === 'textarea') return `${inputBase} resize-vertical`;
  if (component === 'button') return buttonBase;
  return `rounded-[${designTokens.radius.card}] border border-slate-800 bg-[var(--color-surface)] p-6 transition-all duration-[var(--motion-base)]`;
}

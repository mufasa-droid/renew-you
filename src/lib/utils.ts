/**
 * Utility helper to join class names cleanly
 */
export function cn(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}

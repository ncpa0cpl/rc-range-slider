export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2);
}

export function linear(x: number): number {
  return x;
}

export type Easing = (t: number) => number;

export const applyEasing = (
  easing: Easing,
  value: number,
  progress: number
): number => {
  return easing(progress) * value;
};

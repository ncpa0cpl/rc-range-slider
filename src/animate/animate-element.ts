import { animateLegacy } from "./animate-legacy";
import { animateWebAPI } from "./animate-web-api";
import { Easings } from "./easings";

const IS_WEB_ANIMATE_SUPPORTED = Element.prototype.animate !== undefined;

export type Animation = {
  cancel(): void;
  finalize(): void;
  wait(): Promise<void>;
};

export const animateElement = (
  element: HTMLElement,
  styles: Record<string, string | number>,
  duration: number,
  easing: keyof typeof Easings = "easeInOutSine"
): Animation => {
  if (IS_WEB_ANIMATE_SUPPORTED) {
    return animateWebAPI(element, styles, duration, easing);
  }

  // animation method using requestAnimationFrame
  return animateLegacy(element, styles, duration, easing);
};

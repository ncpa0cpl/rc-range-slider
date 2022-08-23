import { asCssProperty } from "../utilities/as-css-property";
import { asCssPropertyValue } from "../utilities/as-css-property-value";
import { extractOverlappingProperties } from "../utilities/extract-overlaping-properties";
import { Animation } from "./animate-element";
import { Easings } from "./easings";
import { getIntermediateValue } from "./get-intermediate-value";

export const animateLegacy = (
  element: HTMLElement,
  styles: Record<string, string | number>,
  duration: number,
  easing: keyof typeof Easings = "easeInOutSine"
): Animation => {
  const initialStyle = extractOverlappingProperties(
    getComputedStyle(element) as any,
    styles
  );

  let animationID: number;
  let start: number;
  let isFinished = false;

  let resolveAnimationPromise = () => {};

  const animationPromise = new Promise<void>((resolve) => {
    resolveAnimationPromise = resolve;

    const step = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }

      const elapsed = timestamp - start;
      const progress = elapsed / duration;
      const end = progress >= 1;

      if (end) {
        for (const [key, value] of Object.entries(styles)) {
          element.style.setProperty(asCssProperty(key), value.toString());
        }
        cancelAnimationFrame(animationID);
        isFinished = true;
        resolve();
      } else {
        for (const [key, value] of Object.entries(styles)) {
          const startValue =
            initialStyle[key] ?? initialStyle[asCssProperty(key)];

          if (startValue !== undefined) {
            element.style.setProperty(
              asCssProperty(key),
              getIntermediateValue(
                startValue,
                value,
                progress,
                easing === "linear" ? Easings.linear : Easings.easeInOutQuad
              )
            );
          } else {
            element.style.setProperty(
              asCssProperty(key),
              asCssPropertyValue(value)
            );
          }
        }
        animationID = requestAnimationFrame(step);
      }
    };

    animationID = window.requestAnimationFrame(step);
  });

  return {
    cancel() {
      window.cancelAnimationFrame(animationID);
      resolveAnimationPromise();
    },
    finalize() {
      if (!isFinished) {
        window.cancelAnimationFrame(animationID);
        for (const [key, value] of Object.entries(styles)) {
          element.style.setProperty(asCssProperty(key), value.toString());
        }
        resolveAnimationPromise();
      }
    },
    wait() {
      if (isFinished) return Promise.resolve();
      return animationPromise;
    },
  };
};

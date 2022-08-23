import { extractOverlappingProperties } from "../utilities/extract-overlaping-properties";
import { kebabCaseToCamelCase } from "../utilities/kebab-case-to-camel-case";
import { mapObject } from "../utilities/map-object";
import { Animation } from "./animate-element";
import { Easings } from "./easings";

type WebApiEasing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

const mapToWebAPIEasing = (easing: keyof typeof Easings): WebApiEasing => {
  if (easing === "linear") {
    return "linear";
  } else if (easing.startsWith("easeInOut")) {
    return "ease-in-out";
  } else if (easing.startsWith("easeIn")) {
    return "ease-in";
  } else if (easing.startsWith("easeOut")) {
    return "ease-out";
  } else {
    return "ease";
  }
};

export const animateWebAPI = (
  element: HTMLElement,
  styles: Record<string, string | number>,
  duration: number,
  easing: keyof typeof Easings = "easeInOutSine"
): Animation => {
  const initialStyle = extractOverlappingProperties(
    getComputedStyle(element) as any,
    styles
  );

  const animation = element.animate(
    [
      mapObject(initialStyle, ([key, value]) => [
        kebabCaseToCamelCase(key),
        value,
      ]),
      styles,
    ],
    {
      duration,
      fill: "forwards",
      iterations: 1,
      easing: mapToWebAPIEasing(easing),
    }
  );

  const animationPromise = new Promise<void>((resolve) => {
    animation.onfinish = () => {
      animation.commitStyles();
      animation.cancel();
      resolve();
    };
    animation.oncancel = () => {
      resolve();
    };
  });

  return {
    cancel() {
      animation.cancel();
    },
    finalize() {
      animation.commitStyles();
      animation.cancel();
    },
    wait() {
      return animationPromise;
    },
  };
};

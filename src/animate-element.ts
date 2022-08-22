import Color from "color";
import cssColorNames from "color-name";
import { asCssProperty } from "./as-css-property";
import { asCssPropertyValue } from "./as-css-property-value";
import { easeInOutQuad, Easing, linear } from "./easings";

const BROWSER_SUPPORTS_WEB_ANIMATE = Element.prototype.animate !== undefined;

const isColor = (value: string) => {
  return (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    value in cssColorNames
  );
};

function kebabCaseToCamelCase(str: string) {
  let arr = str.split("-");
  let capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  let capitalString = capital.join("");

  return capitalString;
}

const camelizeStyleSheet = (styleSheet: Record<string, string | number>) => {
  return Object.fromEntries(
    Object.entries(styleSheet).map(([property, value]) => {
      return [kebabCaseToCamelCase(property), value];
    })
  );
};

const getCurrentOverlappingStyleProperties = (
  currentStyle: Record<string, string>,
  newStyle: Record<string, string | number>
) =>
  Object.fromEntries(
    Object.entries(newStyle)
      .map(([property]) => {
        if (property in currentStyle) {
          return [property, currentStyle[property]];
        }
        return [property, ""];
      })
      .filter(([_, value]) => !!value)
  );

const getIntermediateStyleProperty = (
  start: string | number,
  end: string | number,
  progress: number,
  easing: Easing = linear
): string => {
  progress = easing(progress);

  if (typeof start === "number" && typeof end === "number") {
    return asCssPropertyValue(start + (end - start) * progress);
  }

  if (typeof start === "string" && typeof end === "string") {
    const [, startValue, startUnit] = start.match(/^([\d.]+)(.*)$/) ?? [];
    const [, endValue, endUnit] = end.match(/^([\d.]+)(.*)$/) ?? [];

    if (startValue && endValue && startUnit === endUnit) {
      const interValue =
        Number(startValue) + (Number(endValue) - Number(startValue)) * progress;

      return startUnit
        ? `${interValue}${startUnit}`
        : asCssPropertyValue(interValue);
    }

    if (isColor(start) && isColor(end)) {
      return Color(start).mix(Color(end), progress).hex();
    }
  }

  return asCssPropertyValue(end);
};

export const animateElement = (
  element: HTMLElement,
  styles: Record<string, string | number>,
  duration: number,
  easing: "ease-in-out" | "linear"
): (() => void) => {
  const currentStyle = getCurrentOverlappingStyleProperties(
    getComputedStyle(element) as any,
    styles
  );

  if (BROWSER_SUPPORTS_WEB_ANIMATE) {
    const animation = element.animate(
      [camelizeStyleSheet(currentStyle), styles],
      {
        duration,
        fill: "forwards",
        iterations: 1,
        easing,
      }
    );

    animation.onfinish = () => {
      animation.commitStyles();
    };

    return () => {
      animation.commitStyles();
      animation.cancel();
    };
  }

  // animation method using requestAnimationFrame
  let animationID: number;
  let start: number;

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
    } else {
      for (const [key, value] of Object.entries(styles)) {
        const startValue =
          currentStyle[key] ?? currentStyle[asCssProperty(key)];

        if (startValue !== undefined) {
          element.style.setProperty(
            asCssProperty(key),
            getIntermediateStyleProperty(
              startValue,
              value,
              progress,
              easing === "linear" ? linear : easeInOutQuad
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

  return () => window.cancelAnimationFrame(animationID);
};

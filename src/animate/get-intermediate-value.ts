import Color from "color";
import { asCssPropertyValue } from "../utilities/as-css-property-value";
import { isColorValue } from "../utilities/ic-color-value";
import { parseCssUnitValue } from "../utilities/parse-css-unit-value";
import { Easing } from "./easings";

const getIntermediateNumberValue = (
  start: number,
  end: number,
  progress: number
) => {
  return start + (end - start) * progress;
};

const getIntermediateColorValue = (
  start: string,
  end: string,
  progress: number
): string | null => {
  if (isColorValue(start) && isColorValue(end)) {
    return Color(start).mix(Color(end), progress).hex();
  }
  return null;
};

const getIntermediateUnitValue = (
  start: string,
  end: string,
  progress: number
): string | null => {
  const { unit: startUnit, value: startValue } = parseCssUnitValue(start);
  if (startValue !== null) {
    const { unit: endUnit, value: endValue } = parseCssUnitValue(end);
    if (endValue !== null && startUnit === endUnit) {
      const interValue = getIntermediateNumberValue(
        startValue,
        endValue,
        progress
      );

      return startUnit
        ? `${interValue}${startUnit}`
        : asCssPropertyValue(interValue);
    }
  }
  return null;
};

export const getIntermediateValue = (
  start: string | number,
  end: string | number,
  progress: number,
  easing: Easing
): string => {
  progress = easing(progress);

  if (typeof start === "number" && typeof end === "number") {
    return asCssPropertyValue(getIntermediateNumberValue(start, end, progress));
  }

  if (typeof start === "string" && typeof end === "string") {
    const colorValue = getIntermediateColorValue(start, end, progress);
    if (colorValue) return colorValue;

    const unitValue = getIntermediateUnitValue(start, end, progress);
    if (unitValue) return unitValue;
  }

  return asCssPropertyValue(end);
};

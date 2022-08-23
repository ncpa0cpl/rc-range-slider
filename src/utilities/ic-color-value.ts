import cssColorNamesMap from "color-name";

const CSS_COLOR_NAMES = Object.keys(cssColorNamesMap);

export const isColorValue = (value: string): boolean => {
  return (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    CSS_COLOR_NAMES.includes(value)
  );
};

import { asCssPropertyValue } from "./as-css-property-value";

export const parseStyleSheetValues = (
  styleSheet: Record<string, string | number>
) => {
  return Object.fromEntries(
    Object.entries(styleSheet).map(([property, value]) => {
      return [property, asCssPropertyValue(value)];
    })
  );
};

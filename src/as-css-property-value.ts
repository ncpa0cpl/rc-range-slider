export const asCssPropertyValue = (property: string | number) => {
  if (typeof property === "string") {
    return property;
  }
  return `${property}px`;
};

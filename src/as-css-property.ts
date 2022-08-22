const camelCaseToKebabCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

export const asCssProperty = (property: string) => {
  return camelCaseToKebabCase(property);
};

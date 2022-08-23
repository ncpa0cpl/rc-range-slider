import { camelCaseToKebabCase } from "./camel-case-to-kebab-case";

export const asCssProperty = (property: string) => {
  return camelCaseToKebabCase(property);
};

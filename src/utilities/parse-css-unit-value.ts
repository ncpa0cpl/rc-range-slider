const DIGITS_CAH_CODES = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

export const parseCssUnitValue = (
  value: string
): { unit: string | null; value: number | null } => {
  const digits: string[] = [];
  let unit: string | null = null;

  for (const [index, char] of value.split("").entries()) {
    if (DIGITS_CAH_CODES.includes(char.charCodeAt(0))) {
      digits.push(char);
    } else {
      unit = value.substring(index);
      break;
    }
  }

  return {
    unit,
    value: Number(digits.join("")),
  };
};

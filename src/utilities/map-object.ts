export const mapObject = <
  O extends object,
  RK extends string | number | symbol,
  RV
>(
  obj: O,
  mapper: (entry: [keyof O, O[keyof O]]) => [RK, RV]
): Record<RK, RV> => {
  // @ts-ignore
  return Object.fromEntries(Object.entries(obj).map(mapper));
};

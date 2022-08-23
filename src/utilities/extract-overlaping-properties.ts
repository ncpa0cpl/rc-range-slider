/**
 * Returns a new object that contains a subset of the `target`
 * properties, and includes only those that are present in the
 * `overlapWith` object.
 */
export const extractOverlappingProperties = (
  target: Record<string, string>,
  overlapWith: Record<string, string | number>
): Record<string, string | number> => {
  return Object.fromEntries(
    Object.keys(overlapWith).reduce(
      (entries: [string, string | number][], key) => {
        if (key in target && target[key]) {
          entries.push([key, target[key]!]);
        }

        return entries;
      },
      []
    )
  );
};

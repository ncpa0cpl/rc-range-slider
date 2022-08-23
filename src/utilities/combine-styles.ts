import React from "react";

export const s = (...styles: React.CSSProperties[]) => {
  return styles.reduce((acc, style) => {
    return {
      ...acc,
      ...style,
    };
  }, {});
};

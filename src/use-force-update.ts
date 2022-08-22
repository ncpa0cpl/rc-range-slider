import React from "react";

export const useForceUpdate = () => {
  const [_, forceUpdate] = React.useReducer((i: number) => ++i % 10000, 0);
  return forceUpdate;
};

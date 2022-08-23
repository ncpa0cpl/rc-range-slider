import React, { Dispatch, SetStateAction } from "react";

export const useRefState = <S extends any>(
  initialState: S | (() => S)
): { value: S; ref: { current: S }; set: Dispatch<SetStateAction<S>> } => {
  const [value, setValue] = React.useState(initialState);
  const valueRef = React.useRef(value);

  const set: Dispatch<SetStateAction<S>> = (value) => {
    if (typeof value === "function") {
      setValue((current) => {
        const newValue = (value as (prevState: S) => S)(current);
        valueRef.current = newValue;
        return newValue;
      });
    } else {
      valueRef.current = value;
      setValue(value);
    }
  };

  return {
    value,
    ref: valueRef,
    set,
  };
};

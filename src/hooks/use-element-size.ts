import { ResizeSensor } from "css-element-queries";
import React from "react";

export const useElementSize = () => {
  const [isReady, setIsReady] = React.useState(false);

  const [elemSize, setElemSize] = React.useState({ width: 0, height: 0 });
  const lastRef = React.useRef<HTMLElement | null>(null);

  const sensorRef = React.useRef<ResizeSensor | null>(null);

  React.useEffect(
    () => () => {
      sensorRef.current?.detach();
    },
    []
  );

  return {
    ...elemSize,
    isReady,
    elementProps: {
      ref: (ref: HTMLElement | null) => {
        if (ref && lastRef.current !== ref) {
          lastRef.current = ref;

          setElemSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
          if (!isReady) setIsReady(true);

          sensorRef.current?.detach();
          sensorRef.current = new ResizeSensor(ref, (dimensions) => {
            if (
              dimensions.width !== elemSize.width ||
              dimensions.height !== elemSize.height
            )
              setElemSize({
                width: dimensions.width,
                height: dimensions.height,
              });
          });
        }
      },
    },
  };
};

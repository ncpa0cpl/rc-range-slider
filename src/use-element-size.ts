import { ResizeSensor } from "css-element-queries";
import React from "react";

export const useElementSize = () => {
  const [isReady, setIsReady] = React.useState(false);

  const elemSize = React.useRef({ width: 0, height: 0 });
  const lastRef = React.useRef<HTMLElement | null>(null);

  return {
    ...elemSize.current,
    isReady,
    elementProps: {
      ref: React.useCallback((ref: HTMLElement | null) => {
        if (ref && lastRef.current !== ref) {
          lastRef.current = ref;

          new ResizeSensor(ref, (dimensions) => {
            const changeIsReady = isNaN(elemSize.current.height);

            elemSize.current.height = dimensions.height;
            elemSize.current.width = dimensions.width;

            if (changeIsReady) setIsReady(true);
          });
        }
      }, []),
    },
  };
};

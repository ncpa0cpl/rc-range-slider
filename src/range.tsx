import React from "react";
import { useAnimated } from "./use-animate";
import { useElementSize } from "./use-element-size";
import { useMouseDragTracker } from "./use-mouse-drag-tracker";

const THUMB_SIZE = 16;

export type RangeSliderProps = {};

export const RangeSlider = (props: RangeSliderProps) => {
  const SliderThumb = useAnimated("span", 8, "linear");
  const SliderTrack = useAnimated("span", 8, "linear");

  const wrapperSize = useElementSize();
  
  const { draggedElemProps, useMouseMovement } =
    useMouseDragTracker(10);

  const value = React.useRef(0);

  const clamp = React.useCallback(
    (setter: (current: number) => number) => {
      return Math.max(0, Math.min(wrapperSize.width, setter(value.current)));
    },
    [wrapperSize.width]
  );

  useMouseMovement(
    ({ x }) => {
      if (!wrapperSize.isReady || x === 0) return;

      value.current += x;

      const animateBy = clamp((v) => v + x);

      SliderThumb.animate({
        left: animateBy - THUMB_SIZE / 2,
      });
      SliderTrack.animate({
        width: animateBy,
      });
    },
    [wrapperSize.isReady, wrapperSize.width]
  );

  return (
    <div
      {...wrapperSize.elementProps}
      style={{ display: "flex", position: "relative" }}
    >
      <span
        style={{ width: "100%", height: 5, backgroundColor: "grey" }}
      ></span>
      <SliderTrack.Component
        style={{
          width: 0,
          height: 5,
          backgroundColor: "blue",
          position: "absolute",
          left: 0,
          zIndex: 2,
        }}
      ></SliderTrack.Component>
      <SliderThumb.Component
        {...draggedElemProps}
        style={{
          height: THUMB_SIZE,
          width: THUMB_SIZE,
          backgroundColor: "red",
          position: "absolute",
          zIndex: 3,
          left: 0,
        }}
      ></SliderThumb.Component>
    </div>
  );
};

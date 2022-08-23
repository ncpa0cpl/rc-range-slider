import React from "react";
import { useAnimated } from "./hooks/use-animate";
import { useElementSize } from "./hooks/use-element-size";
import { useMouseDragTracker } from "./hooks/use-mouse-drag-tracker";
import { s } from "./utilities/combine-styles";
import { isLeftMouseClick } from "./utilities/is-left-mouse-click";

export type SliderProps = {
  /** A number in range 0-1 */
  className?: string;
  initialValue?: number;
  orientation?: "horizontal" | "vertical";
  railClassName?: string;
  thumbClassName?: string;
  thumbSize?: number;
  trackClassName?: string;
  trackThickness?: number;
  onSlide?: (value: number) => void;
  onSlideComplete?: (value: number) => void;
};

const clamp = (value: number) => {
  return Math.max(0, Math.min(1, value));
};

export const Slider = React.memo((props: SliderProps) => {
  const thumbSize = props.thumbSize ?? 16;
  const trackThickness = props.trackThickness ?? 5;
  const orientation = props.orientation ?? "horizontal";

  const SliderThumb = useAnimated("span", 8, "linear");
  const SliderTrack = useAnimated("span", 8, "linear");

  const wrapperSize = useElementSize();

  const { draggedElemProps, useMouseMovement, isDragging } =
    useMouseDragTracker(12);

  const trueMouseOffset = React.useRef(0);
  const value = React.useRef(props.initialValue ?? 0);

  const clampToWidth = React.useCallback(
    (value: number) => {
      return Math.max(0, Math.min(wrapperSize.width, value));
    },
    [wrapperSize.width]
  );

  const clampToHeight = React.useCallback(
    (value: number) => {
      return Math.max(0, Math.min(wrapperSize.height, value));
    },
    [wrapperSize.height]
  );

  const handleTrackClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isLeftMouseClick(e)) return;

      if (orientation === "horizontal") {
        const ratio = e.nativeEvent.offsetX / wrapperSize.width;
        trueMouseOffset.current = ratio;
        value.current = clamp(ratio);
        const animateBy = clampToWidth(value.current * wrapperSize.width);

        SliderThumb.animate(
          {
            left: animateBy - thumbSize / 2,
          },
          75
        );
        SliderTrack.animate(
          {
            width: animateBy,
          },
          75
        );
      } else {
        const ratio =
          // @ts-ignore
          (e.currentTarget.offsetHeight - e.nativeEvent.offsetY) /
          wrapperSize.height;
        trueMouseOffset.current = ratio;
        value.current = clamp(ratio);
        const animateBy = clampToHeight(value.current * wrapperSize.height);

        SliderThumb.animate(
          {
            bottom: animateBy - thumbSize / 2,
          },
          75
        );
        SliderTrack.animate(
          {
            height: animateBy,
          },
          75
        );
      }

      if (props.onSlide) {
        props.onSlide(value.current);
      }
    },
    [orientation, wrapperSize.height, wrapperSize.width, thumbSize]
  );

  useMouseMovement(
    ({ x, y }) => {
      if (!wrapperSize.isReady) return;

      if (orientation === "horizontal") {
        if (x === 0) return;

        const ratio = x / wrapperSize.width;
        trueMouseOffset.current += ratio;
        value.current = clamp(trueMouseOffset.current);

        const animateBy = clampToWidth(value.current * wrapperSize.width);

        SliderThumb.animate({
          left: animateBy - thumbSize / 2,
        });
        SliderTrack.animate({
          width: animateBy,
        });
      } else {
        if (y === 0) return;

        const ratio = -y / wrapperSize.height;
        trueMouseOffset.current += ratio;
        value.current = clamp(trueMouseOffset.current);

        const animateBy = clampToHeight(value.current * wrapperSize.height);

        SliderThumb.animate({
          bottom: animateBy - thumbSize / 2,
        });
        SliderTrack.animate({
          height: animateBy,
        });
      }

      if (props.onSlide) {
        props.onSlide(value.current);
      }
    },
    [wrapperSize.isReady, wrapperSize.width, wrapperSize.height, thumbSize]
  );

  React.useEffect(() => {
    if (!wrapperSize.isReady) return;
    if (orientation === "horizontal") {
      SliderThumb.set({
        left: clampToWidth(value.current * wrapperSize.width) - thumbSize / 2,
        bottom: "unset",
        top: 2,
        width: thumbSize,
        height: thumbSize,
      });
      SliderTrack.set({
        width: clampToWidth(value.current * wrapperSize.width),
        height: trackThickness,
        left: 0,
        bottom: "calc(50% - " + trackThickness / 2 + "px)",
      });
    } else {
      SliderThumb.set({
        top: "unset",
        bottom:
          clampToHeight(value.current * wrapperSize.height) - thumbSize / 2,
        left: 2,
        width: thumbSize,
        height: thumbSize,
      });
      SliderTrack.set({
        height: clampToHeight(value.current * wrapperSize.height),
        width: trackThickness,
        left: "calc(50% - " + trackThickness / 2 + "px)",
        bottom: 0,
      });
    }
  }, [
    orientation,
    thumbSize,
    trackThickness,
    wrapperSize.width,
    wrapperSize.height,
  ]);

  React.useEffect(() => {
    if (!isDragging) {
      trueMouseOffset.current = value.current;
      if (props.onSlideComplete) props.onSlideComplete(value.current);
    }
  }, [isDragging]);

  return (
    <div
      {...wrapperSize.elementProps}
      className={props.className}
      style={s(
        {
          display: "flex",
          position: "relative",
          minHeight: thumbSize + 4,
          minWidth: thumbSize + 4,
        },
        orientation === "horizontal"
          ? { width: "100%", height: "fit-content" }
          : { width: "fit-content", height: "100%" }
      )}
    >
      <span
        {...draggedElemProps}
        onMouseDownCapture={handleTrackClick}
        className={props.railClassName}
        style={
          orientation === "horizontal"
            ? {
                width: "100%",
                height: trackThickness,
                backgroundColor: "grey",
                position: "absolute",
                bottom: "calc(50% - " + trackThickness / 2 + "px)",
              }
            : {
                height: "100%",
                width: trackThickness,
                backgroundColor: "grey",
                position: "absolute",
                left: "calc(50% - " + trackThickness / 2 + "px)",
              }
        }
      />
      <SliderTrack.Component
        {...draggedElemProps}
        onMouseDownCapture={handleTrackClick}
        className={props.trackClassName}
        initialStyle={s(
          {
            backgroundColor: "blue",
            position: "absolute",
            zIndex: "2",
            left: 0,
            bottom: 0,
          },
          orientation === "horizontal"
            ? { left: 0, bottom: "calc(50% - " + trackThickness / 2 + "px)" }
            : { left: "calc(50% - " + trackThickness / 2 + "px)", bottom: 0 }
        )}
      />
      <SliderThumb.Component
        {...draggedElemProps}
        className={props.thumbClassName}
        initialStyle={{
          backgroundColor: "red",
          position: "absolute",
          zIndex: "3",
        }}
      />
    </div>
  );
});

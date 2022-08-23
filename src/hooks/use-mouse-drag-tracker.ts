import throttle from "lodash.throttle";
import React from "react";
import { isLeftMouseClick } from "../utilities/is-left-mouse-click";
import { useRefState } from "./use-ref-state";

type MouseMovement = {
  x: number;
  y: number;
};

export const useMouseDragTracker = (throttleTime = 0) => {
  const isMouseDown = useRefState(false);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    // if the left mouse button is clicked
    if (isLeftMouseClick(e)) isMouseDown.set(true);

    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onMoveListener = React.useRef<
    null | ((movement: MouseMovement) => void)
  >(null);

  const useMouseMovement = (
    onMove: (movement: MouseMovement) => void,
    deps: any[]
  ) => {
    React.useEffect(() => {
      const listener = (movement: MouseMovement) => {
        onMove(movement);
      };

      onMoveListener.current = listener;

      return () => {
        onMoveListener.current = () => {};
      };
    }, [deps]);
  };

  React.useEffect(() => {
    if (document) {
      let lastMovement: MouseMovement = { x: 0, y: 0 };

      const onMouseUp = () => {
        isMouseDown.set(false);
        lastMovement.x = 0;
        lastMovement.y = 0;
      };

      let propagateMovementEvent = () => {
        if (onMoveListener.current) {
          onMoveListener.current({
            x: lastMovement.x / window.devicePixelRatio,
            y: lastMovement.y / window.devicePixelRatio,
          });

          lastMovement.x = 0;
          lastMovement.y = 0;
        }
      };

      if (throttleTime > 0) {
        propagateMovementEvent = throttle(propagateMovementEvent, throttleTime);
      }

      const onMouseMove = (e: MouseEvent) => {
        if (isMouseDown.ref.current) {
          lastMovement = {
            x: lastMovement.x + e.movementX,
            y: lastMovement.y + e.movementY,
          };

          propagateMovementEvent();
        }
      };

      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
      return () => {
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousemove", onMouseMove);
      };
    }

    return () => {};
  }, []);

  return {
    draggedElemProps: { onMouseDown, draggable: false },
    isDragging: isMouseDown.value,
    useMouseMovement,
  };
};

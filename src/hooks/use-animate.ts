import React from "react";
import { animateElement, Animation } from "../animate/animate-element";
import { Easings } from "../animate/easings";
import { asCssProperty } from "../utilities/as-css-property";
import { asCssPropertyValue } from "../utilities/as-css-property-value";
import { mapObject } from "../utilities/map-object";

export const useAnimated = <T extends keyof JSX.IntrinsicElements>(
  tag: T,
  duration: number,
  easing: keyof typeof Easings = "easeInOutSine"
) => {
  const animationSettings = React.useRef({
    duration,
    easing,
  });

  const elementRef = React.useRef<HTMLElement | null>(null);
  const lastAnimation = React.useRef<Animation | null>(null);

  const previousAnimatedStyles = React.useRef<Record<string, string | number>>(
    {}
  );

  const animate = React.useCallback(
    (styles: React.CSSProperties, customDuration?: number) => {
      if (elementRef.current && styles) {
        let changeDetected = false;

        const propertiesToAnimate: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(styles)) {
          // if the style is different than what was set previously
          if (value !== previousAnimatedStyles.current[key]) {
            changeDetected = true;
            propertiesToAnimate[key] = value;
          }
        }

        if (changeDetected) {
          if (lastAnimation.current) lastAnimation.current.finalize();

          lastAnimation.current = animateElement(
            elementRef.current,
            mapObject(propertiesToAnimate, ([key, value]) => [
              key,
              asCssPropertyValue(value),
            ]),
            customDuration ?? animationSettings.current.duration,
            animationSettings.current.easing
          );

          Object.assign(previousAnimatedStyles.current, styles);
        }
      }
    },
    []
  );

  const set = React.useCallback((styles: React.CSSProperties) => {
    if (elementRef.current) {
      if (lastAnimation.current) lastAnimation.current.finalize();

      for (const [key, value] of Object.entries(styles)) {
        elementRef.current.style.setProperty(
          asCssProperty(key),
          asCssPropertyValue(value)
        );
      }

      Object.assign(previousAnimatedStyles.current, styles);
    }
  }, []);

  React.useEffect(() => {
    animationSettings.current.duration = duration;
    animationSettings.current.easing = easing;
  }, [easing, duration]);

  const [Component] = React.useState(
    (): React.FC<
      Omit<JSX.IntrinsicElements[T], "ref" | "style"> & {
        initialStyle: React.CSSProperties;
      }
    > =>
      React.memo(({ initialStyle, children, ...props }) => {
        const onRefSet = (elem: HTMLElement | null) => {
          if (elem) {
            if (elem !== elementRef.current) {
              elementRef.current = elem;
              if (initialStyle) set(initialStyle);
            }
          }
        };

        React.useEffect(
          () => () => {
            if (lastAnimation.current) lastAnimation.current.cancel();
          },
          []
        );

        return React.createElement(tag, { ...props, ref: onRefSet }, children);
      })
  );

  return { Component, animate, set };
};

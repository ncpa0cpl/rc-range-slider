import React from "react";
import { animateElement } from "./animate-element";
import { asCssProperty } from "./as-css-property";
import { asCssPropertyValue } from "./as-css-property-value";
import { parseStyleSheetValues } from "./parse-stylesheet-values";

export const useAnimated = <T extends keyof JSX.IntrinsicElements>(
  tag: T,
  duration: number,
  easing: "ease-in-out" | "linear" = "ease-in-out"
) => {
  const elementRef = React.useRef<HTMLElement | null>(null);
  const lastAnimation = React.useRef<(() => void) | null>(null);

  const animate = React.useCallback(
    (styles: Record<string, string | number>) => {
      if (elementRef.current) {
        if (lastAnimation.current) lastAnimation.current();

        lastAnimation.current = animateElement(
          elementRef.current,
          parseStyleSheetValues(styles),
          duration,
          easing
        );
      }
    },
    [duration, easing]
  );

  const [Component] = React.useState(
    (): React.FC<
      Omit<JSX.IntrinsicElements[T], "ref"> & {
        animatedStyle?: React.CSSProperties;
      }
    > =>
      React.memo(({ animatedStyle, style, children, ...props }) => {
        const onRefSet = (elem: HTMLElement | null) => {
          if (elem) {
            if (elem !== elementRef.current) {
              if (style)
                for (const [key, value] of Object.entries(style)) {
                  elem.style.setProperty(
                    asCssProperty(key),
                    asCssPropertyValue(value)
                  );
                }

              if (animatedStyle)
                for (const [key, value] of Object.entries(animatedStyle)) {
                  elem.style.setProperty(
                    asCssProperty(key),
                    asCssPropertyValue(value)
                  );
                }
            }
            elementRef.current = elem;
          }
        };

        const previousAnimatedStyles = React.useRef<
          Record<string, string | number>
        >({});

        React.useEffect(() => {
          if (elementRef.current && animatedStyle) {
            let changeDetected = false;

            const propertiesToAnimate: Record<string, string | number> = {};
            for (const [key, value] of Object.entries(animatedStyle)) {
              // if the style is different than what was set previously
              if (value !== previousAnimatedStyles.current[key]) {
                changeDetected = true;
                propertiesToAnimate[key] = value;
              }
            }

            if (changeDetected) {
              animate(propertiesToAnimate);
              Object.assign(previousAnimatedStyles.current, animatedStyle);
            }
          }
        }, [animatedStyle]);

        React.useEffect(
          () => () => {
            if (lastAnimation.current) lastAnimation.current();
          },
          []
        );

        return React.createElement(tag, { ...props, ref: onRefSet }, children);
      })
  );

  return { Component, animate };
};

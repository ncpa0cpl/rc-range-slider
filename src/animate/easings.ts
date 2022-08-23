export type Easing = (t: number) => number;

export const Easings = {
  easeInBack: (x: number) =>
    2.70158 * Math.pow(x, 3) - 1.70158 * Math.pow(x, 2),
  easeInBounce: (x: number) => 1 - Easings.easeOutBounce(1 - x),
  easeInCirc: (x: number) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  easeInCubic: (x: number) => Math.pow(x, 3),
  easeInElastic: (x: number) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) *
        Math.sin((x * 10 - 10.75) * ((2 * Math.PI) / 3)),
  easeInExpo: (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
  easeInOutBack: (x: number) =>
    x < 0.5
      ? (Math.pow(2 * x, 2) * ((2.5949095 + 1) * 2 * x - 2.5949095)) / 2
      : (Math.pow(2 * x - 2, 2) * ((2.5949095 + 1) * (x * 2 - 2) + 2.5949095) +
          2) /
        2,
  easeInOutBounce: (x: number) =>
    x < 0.5
      ? (1 - Easings.easeOutBounce(1 - 2 * x)) / 2
      : (1 + Easings.easeOutBounce(2 * x - 1)) / 2,
  easeInOutCirc: (x: number) =>
    x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
  easeInOutCubic: (x: number) =>
    x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,
  easeInOutElastic: (x: number) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(
          Math.pow(2, 20 * x - 10) *
          Math.sin((20 * x - 11.125) * ((2 * Math.PI) / 4.5))
        ) / 2
      : (Math.pow(2, -20 * x + 10) *
          Math.sin((20 * x - 11.125) * ((2 * Math.PI) / 4.5))) /
          2 +
        1,
  easeInOutExpo: (x: number) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2,
  easeInOutQuad: (x: number) =>
    x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2,
  easeInOutQuart: (x: number) =>
    x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) / 2,
  easeInOutQuint: (x: number) =>
    x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2,
  easeInOutSine: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  easeInQuad: (x: number) => Math.pow(x, 2),
  easeInQuart: (x: number) => Math.pow(x, 4),
  easeInQuint: (x: number) => Math.pow(x, 5),
  easeInSine: (x: number) => 1 - Math.cos((x * Math.PI) / 2),
  easeOutBack: (x: number) =>
    1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2),
  easeOutBounce: (x: number) => {
    if (x < 1 / 2.75) {
      return 7.5625 * Math.pow(x, 2);
    } else if (x < 2 / 2.75) {
      return 7.5625 * (x -= 1.5 / 2.75) * x + 0.75;
    } else if (x < 2.5 / 2.75) {
      return 7.5625 * (x -= 2.25 / 2.75) * x + 0.9375;
    } else {
      return 7.5625 * (x -= 2.625 / 2.75) * x + 0.984375;
    }
  },
  easeOutCirc: (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2)),
  easeOutCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  easeOutElastic: (x: number) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) +
        1,
  easeOutExpo: (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  easeOutQuad: (x: number) => 1 - (1 - x) * (1 - x),
  easeOutQuart: (x: number) => 1 - Math.pow(1 - x, 4),
  easeOutQuint: (x: number) => 1 - Math.pow(1 - x, 5),
  easeOutSine: (x: number) => Math.sin((x * Math.PI) / 2),
  linear: (x: number) => x,
};

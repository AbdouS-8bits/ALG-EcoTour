/**
 * Animation utilities using anime.js
 * Import and use these functions for advanced animations
 * 
 * To use anime.js, install it first:
 * npm install animejs
 * 
 * Then import: import anime from 'animejs';
 */

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  autoplay?: boolean;
}

export const animationPresets = {
  // Easing functions
  easing: {
    smooth: 'easeInOutCubic',
    elastic: 'easeOutElastic(1, .6)',
    bounce: 'easeOutBounce',
    linear: 'linear',
    sharp: 'easeInOutQuad',
  },

  // Duration presets
  duration: {
    fast: 300,
    normal: 600,
    slow: 1000,
    verySlow: 1500,
  },

  // Delay presets
  delay: {
    none: 0,
    short: 100,
    medium: 200,
    long: 300,
    veryLong: 500,
  },
};

/**
 * Stagger animation for elements
 * Delays each element by a calculated amount
 */
export const staggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

/**
 * Entry animations for page loads
 */
export const entryAnimations = {
  fadeInUp: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateY: [20, 0],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  fadeInDown: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  fadeInLeft: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateX: [-30, 0],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  fadeInRight: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateX: [30, 0],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  scaleIn: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.elastic,
  }),

  rotateIn: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    rotate: [-10, 0],
    scale: [0.9, 1],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.elastic,
  }),
};

/**
 * Hover and interaction animations
 */
export const interactionAnimations = {
  hoverScale: {
    scale: [1, 1.05],
    duration: 300,
    easing: animationPresets.easing.smooth,
  },

  hoverLift: {
    translateY: [0, -8],
    duration: 300,
    easing: animationPresets.easing.smooth,
  },

  hoverGlow: {
    boxShadow: [
      '0 0 0px rgba(34, 197, 94, 0)',
      '0 0 20px rgba(34, 197, 94, 0.5)',
    ],
    duration: 300,
    easing: animationPresets.easing.smooth,
  },

  click: {
    scale: [1, 0.95, 1],
    duration: 300,
    easing: animationPresets.easing.bounce,
  },

  pulse: {
    scale: [1, 1.1, 1],
    duration: 500,
    easing: animationPresets.easing.bounce,
  },
};

/**
 * Scroll and reveal animations
 */
export const scrollAnimations = {
  revealFromLeft: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateX: [-50, 0],
    duration: config?.duration || animationPresets.duration.slow,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  revealFromRight: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateX: [50, 0],
    duration: config?.duration || animationPresets.duration.slow,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  revealFromBottom: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    translateY: [50, 0],
    duration: config?.duration || animationPresets.duration.slow,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),

  expandHeight: (config?: AnimationConfig) => ({
    height: [0, 'auto'],
    opacity: [0, 1],
    duration: config?.duration || animationPresets.duration.normal,
    delay: config?.delay || animationPresets.delay.none,
    easing: config?.easing || animationPresets.easing.smooth,
  }),
};

/**
 * Loading and transition animations
 */
export const loadingAnimations = {
  spinner: {
    rotate: [0, 360],
    duration: 1000,
    easing: 'linear',
    loop: true,
  },

  dots: {
    opacity: [0.3, 1, 0.3],
    duration: 1000,
    easing: 'easeInOutQuad',
    loop: true,
  },

  shimmer: {
    backgroundPosition: ['-1000px 0', '1000px 0'],
    duration: 2000,
    easing: 'linear',
    loop: true,
  },

  bounce: {
    translateY: [0, -20, 0],
    duration: 800,
    easing: animationPresets.easing.bounce,
    loop: true,
  },
};

/**
 * Text animations
 */
export const textAnimations = {
  typewriter: (config?: AnimationConfig) => ({
    opacity: [0, 1],
    duration: config?.duration || animationPresets.duration.slow,
    delay: config?.delay || animationPresets.delay.none,
    easing: animationPresets.easing.linear,
  }),

  wiggle: {
    rotate: [0, -2, 2, -2, 2, 0],
    duration: 600,
    easing: animationPresets.easing.linear,
  },

  glow: {
    textShadow: [
      '0 0 5px rgba(34, 197, 94, 0)',
      '0 0 20px rgba(34, 197, 94, 0.8)',
    ],
    duration: 1500,
    easing: 'easeInOutQuad',
    loop: true,
    direction: 'alternate',
  },
};

/**
 * Combined animation sequences
 */
export const sequences = {
  cardEnter: (delay: number = 0) => [
    {
      targets: '.card',
      opacity: [0, 1],
      scale: [0.9, 1],
      translateY: [20, 0],
      duration: 600,
      delay: delay,
      easing: animationPresets.easing.elastic,
    },
  ],

  listReveal: (baseDelay: number = 0) => [
    {
      targets: '.list-item',
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 500,
      delay: (el: any, i: number) => baseDelay + i * 100,
      easing: animationPresets.easing.smooth,
    },
  ],

  modalOpen: {
    targets: '.modal',
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 400,
    easing: animationPresets.easing.elastic,
  },

  modalClose: {
    targets: '.modal',
    opacity: [1, 0],
    scale: [1, 0.95],
    duration: 300,
    easing: animationPresets.easing.smooth,
  },
};

export default animationPresets;

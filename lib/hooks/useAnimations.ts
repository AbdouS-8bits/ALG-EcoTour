/**
 * Custom React hooks for animations
 * Usage: const ref = useAnimateOnScroll();
 *        <div ref={ref}>Content that animates on scroll</div>
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAnimateOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  animationClass?: string;
  triggerOnce?: boolean;
}

/**
 * Hook that triggers animation classes when element scrolls into view
 */
export const useAnimateOnScroll = (
  options: UseAnimateOnScrollOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    animationClass = 'animate-fade-in-up',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    if (isVisible && ref.current) {
      ref.current.classList.add(animationClass);
    }
  }, [isVisible, animationClass]);

  return ref;
};

/**
 * Hook for hover animations
 */
export const useHoverAnimation = (animationClass: string = 'organic-hover') => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.classList.add(animationClass);

    return () => {
      element.classList.remove(animationClass);
    };
  }, [animationClass]);

  return ref;
};

/**
 * Hook for staggered animations on child elements
 */
export const useStaggerAnimation = (
  animationClass: string = 'animate-fade-in-up'
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const children = element.querySelectorAll('[data-stagger]');
    children.forEach((child, index) => {
      const element = child as HTMLElement;
      element.style.animationDelay = `${index * 0.1}s`;
      element.classList.add(animationClass);
    });
  }, [animationClass]);

  return ref;
};

/**
 * Hook for triggering animations on demand
 */
export const useAnimationTrigger = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const trigger = (callback?: () => void) => {
    setShouldAnimate(true);
    if (callback) {
      callback();
    }
  };

  const reset = () => {
    setShouldAnimate(false);
  };

  return { shouldAnimate, trigger, reset };
};

/**
 * Hook for timing animations
 */
export const useAnimationDelay = (delay: number) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isReady;
};

/**
 * Hook for scroll-triggered animations with multiple states
 */
export const useScrollProgress = (ref: React.RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      let newProgress = 0;
      if (elementBottom > 0 && elementTop < windowHeight) {
        newProgress = 1 - (elementTop / windowHeight);
        newProgress = Math.max(0, Math.min(1, newProgress));
      }

      setProgress(newProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
};

/**
 * Hook for parallax scroll effects
 */
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const newOffset = (windowHeight - elementTop) * speed;
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translateY(${offset}px)`;
    }
  }, [offset]);

  return ref;
};

/**
 * Hook for animated counter
 */
export const useAnimatedCounter = (
  target: number,
  duration: number = 2000,
  trigger: boolean = true
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start: number | null = null;
    const increment = target / (duration / 10);

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = timestamp - start;

      if (progress < duration) {
        setCount(Math.floor(Math.min(target, (progress / duration) * target)));
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, trigger]);

  return count;
};

/**
 * Hook for element visibility with optional animation
 */
export const useElementVisibility = (
  options: UseAnimateOnScrollOptions = {}
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

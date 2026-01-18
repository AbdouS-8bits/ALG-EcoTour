# Global CSS & Animation Guide

## Overview

The updated `globals.css` file includes:
- Enhanced color variables (Eco, Earth, Ocean, Sunset palettes)
- Comprehensive animation system
- Glassmorphism effects
- Responsive utilities
- Accessibility support
- Dark mode support

## Color Palette

### Primary Colors
- **Green (Eco)**: `#22c55e` - Primary action color
- **Earth (Gold)**: `#facc15` - Secondary highlights
- **Ocean (Sky)**: `#0ea5e9` - Tertiary accent
- **Sunset (Orange)**: `#f97316` - Call-to-action
- **Sand (Neutral)**: `#78716c` - Text and backgrounds

### Usage
```css
/* Use CSS variables */
color: var(--brand-green-500);
background: var(--brand-ocean-100);
box-shadow: var(--shadow-eco);
```

## Animations

### 1. Entry Animations (Page Load)

#### Fade In Variants
```html
<!-- Fade in from bottom -->
<div class="animate-fade-in-up">Content</div>

<!-- Fade in from top -->
<div class="animate-fade-in-down">Content</div>

<!-- Fade in from left -->
<div class="animate-fade-in-left">Content</div>

<!-- Fade in from right -->
<div class="animate-fade-in-right">Content</div>

<!-- Basic fade -->
<div class="animate-fade-in">Content</div>
```

#### Slide Animations
```html
<div class="animate-slide-in-up">Slides in from bottom</div>
<div class="animate-slide-in-down">Slides in from top</div>
```

#### Scale Animations
```html
<div class="animate-scale-in">Scales in smoothly</div>
```

### 2. Continuous Animations

```html
<!-- Pulse effect -->
<div class="animate-pulse-organic">Gentle pulse</div>

<!-- Pulse with glow -->
<button class="animate-pulse-glow">Action button</button>

<!-- Float effect -->
<div class="animate-float">Floating element</div>

<!-- Slow float -->
<div class="animate-float-slow">Slow floating</div>

<!-- Bounce -->
<div class="animate-bounce-organic">Bouncing element</div>

<!-- Shimmer loading effect -->
<div class="animate-shimmer">Loading...</div>

<!-- Rotating element -->
<div class="animate-spin-slow">Spinning</div>

<!-- Neon glow text -->
<h1 class="animate-neon-glow">Glowing text</h1>

<!-- Gradient shift -->
<div class="gradient-bg-nature animate-gradient-shift">Dynamic gradient</div>
```

### 3. Hover Effects

```html
<!-- Basic hover scale -->
<div class="organic-hover">Hover to scale</div>

<!-- Hover lift up -->
<button class="organic-hover-lift">Click me</button>

<!-- Hover grow -->
<div class="organic-hover-grow">Grow on hover</div>

<!-- Hover lift with shadow -->
<div class="organic-hover-up">Lifts on hover</div>
```

### 4. Stagger Animations (Lists)

```html
<div class="animate-stagger">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

Each item automatically animates with increasing delays.

### 5. Glassmorphism

```html
<!-- Basic glass effect -->
<div class="glass-effect">
  Frosted glass with blur
</div>

<!-- Large glass effect -->
<div class="glass-effect-lg">
  Larger glass effect with more blur
</div>
```

## Gradient Text & Backgrounds

### Gradient Text
```html
<!-- Eco (Green) -->
<h1 class="gradient-text-eco">Eco heading</h1>

<!-- Earth (Gold) -->
<h1 class="gradient-text-earth">Earth heading</h1>

<!-- Ocean (Blue) -->
<h1 class="gradient-text-ocean">Ocean heading</h1>

<!-- Sunset (Orange) -->
<h1 class="gradient-text-sunset">Sunset heading</h1>

<!-- Nature (Multi-color animated) -->
<h1 class="gradient-text-nature">Nature heading</h1>
```

### Gradient Backgrounds
```html
<div class="gradient-bg-eco">Green background</div>
<div class="gradient-bg-earth">Earth background</div>
<div class="gradient-bg-ocean">Ocean background</div>
<div class="gradient-bg-sunset">Sunset background</div>
<div class="gradient-bg-nature">Animated nature gradient</div>
```

## React Hooks for Animations

### useAnimateOnScroll
Triggers animation when element comes into view:

```tsx
'use client';

import { useAnimateOnScroll } from '@/lib/hooks/useAnimations';

export function AnimatedCard() {
  const ref = useAnimateOnScroll({
    animationClass: 'animate-fade-in-up',
    threshold: 0.2,
    triggerOnce: true,
  });

  return <div ref={ref}>This animates when scrolled into view</div>;
}
```

### useHoverAnimation
Add hover animations:

```tsx
import { useHoverAnimation } from '@/lib/hooks/useAnimations';

export function HoverButton() {
  const ref = useHoverAnimation('organic-hover-lift');

  return <button ref={ref}>Hover me</button>;
}
```

### useStaggerAnimation
Stagger child animations:

```tsx
import { useStaggerAnimation } from '@/lib/hooks/useAnimations';

export function List() {
  const ref = useStaggerAnimation('animate-fade-in-up');

  return (
    <div ref={ref}>
      <div data-stagger>Item 1</div>
      <div data-stagger>Item 2</div>
      <div data-stagger>Item 3</div>
    </div>
  );
}
```

### useAnimationTrigger
Trigger animations on demand:

```tsx
import { useAnimationTrigger } from '@/lib/hooks/useAnimations';

export function ClickAnimation() {
  const { shouldAnimate, trigger } = useAnimationTrigger();

  return (
    <div>
      <button onClick={() => trigger()}>Trigger</button>
      {shouldAnimate && <div class="animate-bounce-organic">Bouncing!</div>}
    </div>
  );
}
```

### useAnimatedCounter
Animate number counting:

```tsx
import { useAnimatedCounter } from '@/lib/hooks/useAnimations';

export function Counter() {
  const count = useAnimatedCounter(1000, 2000, true);
  return <div>Count: {count}</div>;
}
```

### useParallax
Parallax scroll effect:

```tsx
import { useParallax } from '@/lib/hooks/useAnimations';

export function ParallaxSection() {
  const ref = useParallax(0.5);
  return <div ref={ref}>Parallax content</div>;
}
```

### useScrollProgress
Track scroll progress:

```tsx
import { useScrollProgress } from '@/lib/hooks/useAnimations';

export function ScrollTracker() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);

  return (
    <div ref={ref}>
      <div style={{ opacity: progress }}>
        Fades in as you scroll
      </div>
    </div>
  );
}
```

## Responsive Utilities

### Mobile Utilities
```html
<!-- Hidden on mobile -->
<div class="mobile-hidden">Desktop only</div>

<!-- Small text on mobile -->
<p class="mobile-text-sm">Small text</p>

<!-- Full width on mobile -->
<div class="mobile-full-width">Full width</div>

<!-- Responsive padding -->
<div class="mobile-responsive">Content</div>

<!-- Column layout on mobile -->
<div class="flex mobile-flex-col">Items</div>

<!-- Small gap on mobile -->
<div class="gap-8 mobile-gap-4">Items</div>
```

### Touch-Friendly
```html
<!-- 44x44 minimum touch targets -->
<button class="touch-target">Large touch area</button>

<!-- Extra padding for touch -->
<div class="touch-padding">Content</div>
```

### Landscape Mobile
```html
<!-- Hidden in landscape mode -->
<div class="landscape-hidden">Hidden in landscape</div>

<!-- Compact in landscape -->
<div class="landscape-compact">Content</div>
```

### Large Screens (1920px+)
```html
<h1 class="lg-screen-text-lg">Large screen text</h1>
<div class="lg-screen-padding">Generous padding</div>
```

## Accessibility Features

### Respects `prefers-reduced-motion`
Animations automatically disable for users who prefer reduced motion. No additional code needed.

### High Contrast Mode
Use `@media (prefers-contrast: more)` - automatically handled.

### Focus States
All interactive elements have proper focus states:

```html
<!-- Auto-styled input -->
<input type="text" class="focus-organic">

<!-- Custom focus -->
<button class="focus-organic">Click me</button>
```

## Dark Mode

All colors and animations automatically adapt to dark mode via `prefers-color-scheme`:

```tsx
// Automatic dark mode support
<div class="bg-[var(--brand-sand-50)] dark:bg-[var(--brand-sand-900)]">
  Content
</div>
```

## Animation Timing

### Quick Reference
- **Fast**: 300ms (micro-interactions)
- **Normal**: 600ms (standard animations)
- **Slow**: 1000ms (entrance animations)
- **Very Slow**: 1500ms (dramatic reveals)

### Easing Functions
- `var(--transition-organic)`: Smooth, natural feel
- `var(--transition-bounce-organic)`: Bouncy, playful
- `var(--transition-smooth)`: Professional, polished
- `var(--transition-elastic)`: Stretchy, fun

## Usage Examples

### Complete Hero Section
```tsx
export function Hero() {
  const mainRef = useAnimateOnScroll({
    animationClass: 'animate-fade-in-up',
  });

  const headingRef = useAnimateOnScroll({
    animationClass: 'animate-fade-in-down',
  });

  return (
    <section ref={mainRef}>
      <h1 ref={headingRef} class="gradient-text-nature text-4xl">
        Welcome to Algeria EcoTourism
      </h1>
      <p class="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Discover nature's beauty
      </p>
      <button class="organic-hover-lift gradient-bg-eco">
        Explore Tours
      </button>
    </section>
  );
}
```

### Card Grid with Stagger
```tsx
export function TourCards() {
  const ref = useStaggerAnimation('animate-scale-in');

  return (
    <div ref={ref} class="grid grid-cols-3 gap-6">
      {tours.map((tour) => (
        <div key={tour.id} data-stagger class="glass-effect organic-hover">
          {/* Card content */}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use Utility Classes**: Prefer `.animate-fade-in-up` over custom CSS
2. **Respect Motion Preferences**: Hooks automatically handle `prefers-reduced-motion`
3. **Keep Animations Quick**: Most animations should be < 1 second
4. **Stagger Reveals**: Use stagger for lists and grids
5. **Meaningful Motion**: Only animate when it adds value
6. **Test on Mobile**: Ensure animations perform well on low-end devices
7. **Use CSS First**: CSS animations are faster than JavaScript
8. **Combine Effects**: Mix multiple classes for complex animations

## Troubleshooting

### Animation not playing
- Check element is visible in viewport
- Verify CSS is imported in main layout
- Ensure animation class is correctly spelled
- Check `prefers-reduced-motion` setting

### Performance issues
- Reduce number of simultaneous animations
- Use CSS animations over JavaScript
- Avoid animating layout properties (width, height)
- Use `will-change` CSS property sparingly

### Animation duration feels off
- Adjust animation duration in global.css
- Use easing functions for natural feel
- Add stagger delay for sequential elements

## Advanced: Using anime.js (Optional)

If you need more complex animations, install anime.js:

```bash
npm install animejs
```

Then use the presets from `lib/animations.ts`:

```tsx
import anime from 'animejs';
import { animationPresets } from '@/lib/animations';

const handleClick = () => {
  anime({
    targets: '.element',
    ...animationPresets.entryAnimations.scaleIn(),
  });
};
```

---

For questions or issues, refer to the animation files in `/lib/hooks/` and `/lib/animations.ts`.

import { createMediaMatcher } from './createMediaMatcher';

/**
 * bootstrap breakpoints (max-width)
 * - xs, extra-small: 0px
 * - sm, small: 600px
 * - md, medium: 960px
 * - lg, large: 1280px
 * - xl, extra-large: 1920px
 * @see https://material-ui.com/customization/breakpoints/
 */
export const breakpoints = createMediaMatcher({
  xs: '(max-width: 600px)',
  ss: '(max-width: 960px)',
  md: '(max-width: 1280px)',
  lg: '(max-width: 1980px)',
  xl: '(min-width: 1980px)',
});

/**
 * device orientation (orientation)
 * - portrait
 * - landscape
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
 */
export const orientation = createMediaMatcher({
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
});

/**
 * hover capabilities (hover)
 * - capable (mouseDevice)
 * - incapable (touchDevice)
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
 */
export const hover = createMediaMatcher({
  touchDevice: '(hover: none)',
  incapable: '(hover: none)',
  capable: '(hover: hover)',
  mouseDevice: '(hover: hover)',
});

/**
 * dark mode (prefers-reduced-motion)
 * - light
 * - dark
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export const darkMode = createMediaMatcher({
  light: true as any,
  dark: '(prefers-color-scheme: dark)',
});

/**
 * reduced motion (prefers-reduced-motion)
 * - normal
 * - reduce
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
export const reducedMotion = createMediaMatcher({
  normal: true as any,
  reduce: '(prefers-reduced-motion: reduce)',
});

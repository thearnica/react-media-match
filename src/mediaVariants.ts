import { createMediaMatcher } from './createMediaMatcher';

/**
 * bootstrap breakpoints (max-width)
 * - xxs, extra-extra-small: 0px
 * - xs, extra-small: 359px
 * - sm, small: 600px
 * - md, medium: 960px
 * - lg, large: 1280px
 * - xl, extra-large: 1920px
 * @see https://material-ui.com/customization/breakpoints/
 */
export const breakpoints = createMediaMatcher(
  {
    xxs: '(max-width: 359px)',
    xs: '(max-width: 599px)',
    sm: '(max-width: 959px)',
    md: '(max-width: 1279px)',
    lg: '(max-width: 1919px)',
    xl: '(min-width: 1920px)',
  },
  'xxs'
);

/**
 * device orientation (orientation)
 * - portrait
 * - landscape
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
 */
export const orientation = createMediaMatcher(
  {
    portrait: '(orientation: portrait)',
    landscape: '(orientation: landscape)',
  },
  'portrait'
);

/**
 * hover capabilities (hover)
 * - incapable (touchDevice)
 * - capable (mouseDevice)
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
 */
export const hover = createMediaMatcher(
  {
    incapable: '(hover: none)',
    capable: '(hover: hover)',
  },
  'incapable'
);
/**
 * dark mode (prefers-color-scheme)
 * - light
 * - dark
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export const darkMode = createMediaMatcher(
  {
    light: true as any,
    dark: '(prefers-color-scheme: dark)',
  },
  'light'
);

/**
 * reduced motion (prefers-reduced-motion)
 * - normal
 * - reduce
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
export const reducedMotion = createMediaMatcher(
  {
    normal: true as any,
    reduced: '(prefers-reduced-motion: reduce)',
  },
  'normal'
);

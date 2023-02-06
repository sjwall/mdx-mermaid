import type { Config } from './config.model'

export const DEFAULT_DARK_THEME = 'dark'
export const DEFAULT_LIGHT_THEME = 'default'

export const DARK_THEME_KEY = 'dark'
export const LIGHT_THEME_KEY = 'light'

export const HTML_THEME_ATTRIBUTE = 'data-theme'

/**
 * Gets the theme based on config and current data-theme of the HTML.
 *
 * @param html The HTML element of the page.
 * @param config The configuration for this chart.
 */
export function getTheme (html: HTMLHtmlElement, config?: Config): string {
  let htmlTheme = html.getAttribute(HTML_THEME_ATTRIBUTE) ?? LIGHT_THEME_KEY

  if (!(htmlTheme === LIGHT_THEME_KEY || htmlTheme === DARK_THEME_KEY)) {
    htmlTheme = LIGHT_THEME_KEY
  }

  const defaultTheme = htmlTheme === LIGHT_THEME_KEY
    ? DEFAULT_LIGHT_THEME
    : DEFAULT_DARK_THEME

  return config?.theme?.[htmlTheme] ??
    config?.mermaid?.theme ??
    defaultTheme
}

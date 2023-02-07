import type { Config } from './config.model'
import {
  DARK_THEME_KEY,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getTheme,
  HTML_THEME_ATTRIBUTE,
  LIGHT_THEME_KEY
} from './theme.helper'

describe('theme.helper', () => {
  it('returns the default light theme when data-theme is incorrectly configured', () => {
    const html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, 'some bad key')

    expect(getTheme(html)).toEqual(DEFAULT_LIGHT_THEME)
  })

  it('returns the default light theme', () => {
    const html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, LIGHT_THEME_KEY)

    expect(getTheme(html)).toEqual(DEFAULT_LIGHT_THEME)
  })

  it('returns the default dark theme', () => {
    const html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, DARK_THEME_KEY)

    expect(getTheme(html)).toEqual(DEFAULT_DARK_THEME)
  })

  it('returns the configured light theme', () => {
    const html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, LIGHT_THEME_KEY)

    const config: Config = {
      theme: {
        light: 'forest',
        dark: 'default'
      }
    }

    expect(getTheme(html, config)).toEqual(config.theme?.light)
  })

  it('returns the configured dark theme', () => {
    const html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, DARK_THEME_KEY)

    const config: Config = {
      theme: {
        light: 'forest',
        dark: 'default'
      }
    }

    expect(getTheme(html, config)).toEqual(config.theme?.dark)
  })

  it('returns the mermaid config theme', () => {
    const html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, DARK_THEME_KEY)

    const config: Config = {
      mermaid: {
        theme: 'forest'
      }
    }

    expect(getTheme(html, config)).toEqual(config.mermaid?.theme)
  })
})

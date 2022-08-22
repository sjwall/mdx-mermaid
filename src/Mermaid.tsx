/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import React, { useEffect, useState, ReactElement, useMemo } from 'react'
import mermaid from 'mermaid'

import { Config } from './config.model'
import { getTheme } from './theme.helper'

/**
 * Properties for Mermaid component.
 */
export type MermaidProps = {
  /**
   * Mermaid diagram.
   */
  chart: string

  /**
   * Config to initialize mermaid with.
   */
  config?: Config | string
}

/**
 * Component to display Mermaid diagrams.
 *
 * @param param0 Diagram to display.
 * @param param1 Config.
 * @returns The component.
 */
export const Mermaid = ({ chart, config: configSrc }: MermaidProps): ReactElement<MermaidProps> => {
  // Due to Docusaurus not correctly parsing client-side from server-side modules, use the provided workaround
  // found in the accompanying issue: https://github.com/facebook/docusaurus/issues/4268#issuecomment-783553084
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return <div className="mermaid" data-mermaid-src={chart}>{chart}</div>
  }

  const config: Config = useMemo(() => typeof configSrc === 'string' ? JSON.parse(configSrc) : configSrc, [configSrc])

  const html: HTMLHtmlElement = document.querySelector('html')!

  const [rerender, setRerender] = useState<boolean>(false)

  const theme = useMemo(() => getTheme(html, config), [config, rerender])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'data-theme') {
          continue
        }
        setRerender((cur) => !cur)
        break
      }
    })

    observer.observe(html, { attributes: true })
    return () => {
      try {
        observer.disconnect()
      } catch {
        // Do nothing
      }
    }
  }, [])

  useEffect(() => {
    if (config) {
      if (config.mermaid) {
        mermaid.initialize({ startOnLoad: true, ...config.mermaid, theme })
      } else {
        mermaid.initialize({ startOnLoad: true, theme })
      }
      document.querySelectorAll('div.mermaid[data-processed="true"]').forEach((v) => {
        v.removeAttribute('data-processed')
        v.innerHTML = v.getAttribute('data-mermaid-src') as string
      })
      mermaid.contentLoaded()
    }
  }, [config, theme])

  useEffect(() => {
    setTimeout(() => mermaid.contentLoaded, 0)
  }, [chart])

  return <div className="mermaid" data-mermaid-src={chart}>{chart}</div>
}

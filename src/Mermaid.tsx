/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import React, { useEffect, useState, ReactElement } from 'react'
import mermaid from 'mermaid'
import mermaidAPI from 'mermaid/mermaidAPI'

import { Config } from './config.model'
import { getTheme } from './theme.helper'

/**
 * Assign a unique ID to each mermaid svg as per requirements
 * of `mermaid.render`.
 */
let id = 0

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
  config?: Config
}

/**
 * Component to display Mermaid diagrams.
 *
 * @param param0 Diagram to display.
 * @param param1 Config.
 * @returns The component.
 */
export const Mermaid = ({ chart, config }: MermaidProps): ReactElement<MermaidProps> => {
  // Due to Docusaurus not correctly parsing client-side from server-side modules, use the provided workaround
  // found in the accompanying issue: https://github.com/facebook/docusaurus/issues/4268#issuecomment-783553084
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return <div></div>
  }

  const html: HTMLHtmlElement = document.querySelector('html')!

  // Watch for changes in theme in the HTML attribute `data-theme`.
  const [theme, setTheme] = useState<mermaidAPI.Theme>(getTheme(html, config))
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'data-theme') {
        continue
      }

      setTheme(getTheme(html, config))
    }
  })

  observer.observe(html, { attributes: true })

  // When theme updates, rerender the SVG.
  const [svg, setSvg] = useState<string>('')
  useEffect(() => {
    if (config && config.mermaid) {
      mermaid.initialize({ startOnLoad: true, ...config.mermaid, theme })
    } else {
      mermaid.initialize({ startOnLoad: true, theme })
    }

    mermaid.render(`mermaid-svg-${id.toString()}`, chart, (renderedSvg) => setSvg(renderedSvg))
    id++
  }, [theme])

  return <div dangerouslySetInnerHTML={{ __html: svg }}></div>
}

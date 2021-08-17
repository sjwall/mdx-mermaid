/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import React, { useEffect, ReactElement } from 'react'
import mermaid from 'mermaid'

import { Config } from './config.model'

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
  // init diagram once
  useEffect(() => {
    if (config && config.mermaid) {
      mermaid.initialize({ startOnLoad: true, ...config.mermaid })
    }
    mermaid.contentLoaded()
  }, [])
  return <div className="mermaid">{chart}</div>
}

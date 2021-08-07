/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import React, { useEffect, ReactElement } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true
})

/**
 * Properties for Mermaid component.
 */
export type MermaidProps = {
  /**
   * Mermaid diagram.
   */
  chart: string
}

/**
 * Component to display Mermaid diagrams.
 *
 * @param param0 Diagram to display.
 * @returns The component.
 */
export const Mermaid = ({ chart }: MermaidProps): ReactElement<MermaidProps> => {
  // init diagram once
  useEffect(() => {
    mermaid.contentLoaded()
  }, [])
  return <div className="mermaid">{chart}</div>
}

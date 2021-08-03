import React, { useEffect, ReactElement } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
    startOnLoad: true,
})

export type MermaidProps = {
  chart: string
}

export const Mermaid = ({ chart }: MermaidProps): ReactElement<MermaidProps> => {
    useEffect(() => {
        mermaid.contentLoaded()
    }, [])
    return <div className="mermaid">{chart}</div>
}

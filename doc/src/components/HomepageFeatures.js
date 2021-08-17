import React from 'react'
import styles from './HomepageFeatures.module.css'
import { Mermaid } from 'mdx-mermaid/Mermaid'

export default function HomepageFeatures () {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Mermaid chart={`
graph LR;
    User-->mf[Markdown file];
    mf-->cm[\`\`\`mermaid \`\`\`];
    cm-->mdx[mdx-mermaid];
    mdx-->Mermaid;
    Mermaid-->SVG;
`}
// This isn't processed by the parser so needs config passing if it's to be configured
config={{}}/>
        </div>
      </div>
    </section>
  )
}

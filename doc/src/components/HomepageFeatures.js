import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { Mermaid } from 'mdx-mermaid/Mermaid'

export default function HomepageFeatures() {
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
`}/>
        </div>
      </div>
    </section>
  );
}

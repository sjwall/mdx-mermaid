/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import visit from 'unist-util-visit'
import { Literal, Parent, Node, Data } from 'unist'

import { Config } from './config.model'

type CodeMermaid = Literal<string> & {
  type: 'code'
  lang: 'mermaid'
}

/**
 * mdx-mermaid plugin.
 *
 * @param config Config passed in from parser.
 * @returns Function to transform mdxast.
 */
export default function plugin (config?: Config) {
  /**
   * Insert the component import into the document.
   * @param ast The document to insert into.
   */
  function insertImport (ast: Parent<Node<Data> | Literal, Data>) {
    // See if there is already an import for the Mermaid component
    let importFound = false
    visit(ast, { type: 'import' }, (node: Literal<string>) => {
      if (/\s*import\s*{\s*Mermaid\s*}\s*from\s*'mdx-mermaid(\/lib)?\/Mermaid'\s*;?\s*/.test(node.value)) {
        importFound = true
        return visit.EXIT
      }
    })

    // Add the Mermaid component import to the top
    if (!importFound) {
      ast.children.splice(0, 0, {
        type: 'import',
        value: 'import { Mermaid } from \'mdx-mermaid/lib/Mermaid\';'
      })
    }
  }

  return async function transformer (ast: Parent<Node<Data> | Literal, Data>): Promise<Parent> {
    // Find all the mermaid diagram code blocks. i.e. ```mermaid
    const instances: [Literal, number, Parent<Node<Data> | Literal, Data>][] = []
    visit<CodeMermaid>(ast, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
      instances.push([node, index, parent as Parent<Node<Data>, Data>])
    })

    // Replace each Mermaid code block with the Mermaid component
    instances.forEach(([node, index, parent]) => {
      parent.children.splice(index, 1, {
        type: 'jsx',
        value: `<Mermaid chart={\`${node.value}\`}/>`,
        position: node.position
      })
    })

    // Look for any components
    visit<Literal<string> & { type: 'jsx' }>(ast, { type: 'jsx' }, (node, index, parent) => {
      if (/.*<Mermaid.*/.test(node.value)) {
        // If the component doesn't have config
        if (!/.*config={.*/.test(node.value)) {
          const index = node.value.indexOf('<Mermaid') + 8
          node.value = node.value.substring(0, index) +
          ` config={${JSON.stringify(config || {})}}` +
            node.value.substring(index)
        }
        insertImport(ast)
        return visit.EXIT
      }
    })
    return ast
  }
}

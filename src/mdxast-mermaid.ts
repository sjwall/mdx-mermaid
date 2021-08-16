/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import visit from 'unist-util-visit'
import { Literal, Parent, Node, Data } from 'unist'

type CodeMermaid = Literal<string> & {
  type: 'code'
  lang: 'mermaid'
}

function plugin () {
  return async function transformer (ast: Parent<Node<Data> | Literal, Data>): Promise<Parent> {
    // Find all the mermaid diagram code blocks. i.e. ```mermaid
    const instances: [Literal, number, Parent<Node<Data> | Literal, Data>][] = []
    visit<CodeMermaid>(ast, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
      instances.push([node, index, parent as Parent<Node<Data>, Data>])
    })

    // If there are no diagrams return
    if (!instances.length) {
      return ast
    }

    // See if there is already an import for the Mermaid component
    let importFound = false
    visit(ast, { type: 'import' }, (node: Literal<string>) => {
      if (/\s*import\s*{\s*Mermaid\s*}\s*from\s*'mdx-mermaid\/Mermaid'\s*;?\s*/.test(node.value)) {
        importFound = true
        return visit.EXIT
      }
    })

    // Add the Mermaid component import to the top
    let indexModify = 0
    if (!importFound) {
      ast.children.splice(0, 0, {
        type: 'import',
        value: 'import { Mermaid } from \'mdx-mermaid/Mermaid\';'
      })
      indexModify = 1
    }

    // Replace each Mermaid code block with the Mermaid component
    instances.forEach(([node, index, parent]) => {
      parent.children.splice(index + indexModify, 1, {
        type: 'jsx',
        value: `<Mermaid chart={\`${node.value}\`} />`,
        position: node.position
      })
    })
    return ast
  }
}

export = plugin

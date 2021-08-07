import visit from 'unist-util-visit'
import { Literal, Parent, Node, Data } from 'unist'

type CodeMermaid = Literal<string> & {
  type: 'code'
  lang: 'mermaid'
}

function plugin () {
  return async function transformer (ast: Parent<Node<Data> | Literal, Data>): Promise<Parent> {
    const instances: [Literal, number, Parent<Node<Data> | Literal, Data>][] = []
    visit<CodeMermaid>(ast, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
      if (typeof parent !== 'undefined') {
        instances.push([node, index, parent])
      }
    })
    if (!instances.length) {
      return ast
    }

    let importFound = false
    visit(ast, { type: 'import' }, (node: Literal<string>) => {
      if (/\s*import\s*{\s*Mermaid\s*}\s*from\s*'mdx-mermaid\/Mermaid'\s*;?\s*/.test(node.value)) {
        importFound = true
      }
    })
    let indexModify = 0
    if (!importFound) {
      ast.children.splice(0, 0, {
        type: 'import',
        value: 'import { Mermaid } from \'mdx-mermaid/Mermaid\';'
      })
      indexModify = 1
    }
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

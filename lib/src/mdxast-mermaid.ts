/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import { visit } from 'unist-util-visit'
import type { Literal, Parent, Node, Data } from 'unist'
import type { Parent as MdastParent } from 'mdast'
import type mermaid from 'mermaid'
import type { MermaidConfig } from 'mermaid'
import type { Config } from './config.model'
import type { JSXElement, JSXExpressionContainer, JSXIdentifier } from 'estree-jsx'

type CodeMermaid = Literal<string> & {
  type: 'code'
  lang: 'mermaid'
}

/* istanbul ignore next */
const renderToSvg = async (id: string, src: string, config: MermaidConfig, url: string): Promise<string> => {
  const puppeteer = await import('puppeteer')
  let browser = await puppeteer.launch({ args: ["--no-sandbox"] })
  try {
    let page = await browser.newPage()
    await page.goto(
      `data:text/html,<!DOCTYPE html><script src="${url}"></script>`
    )
    return await page.evaluate(
      (diagramId, mermaidDiagram, config) => {
        ((window as any).mermaid as typeof mermaid).initialize({ startOnLoad: false, ...config })
        try {
          return ((window as any).mermaid as typeof mermaid).mermaidAPI.render(diagramId, mermaidDiagram)
        } catch (error) {
          return JSON.stringify(error)
        }
      },
      id,
      src,
      config,
    )
  } finally {
    await browser.close()
  }
}

type OutputResult = (Node<Data> | Literal<unknown, Data>)[]

const createMermaidNode = (node: CodeMermaid, hName: string, config?: Config): OutputResult => {
  return [{
    type: 'mermaidCodeBlock',
    data: {
      hName,
      hProperties: {
        config: JSON.stringify(config),
        chart: node.value,
      },
    },
  }]
}

const outputAST = (node: CodeMermaid, index: number | null, parent: Parent<Node<Data>, Data>, config?: Config): OutputResult => {
  return createMermaidNode(node, 'mermaid', config)
}

/* istanbul ignore next */
const outputSVG = async (node: CodeMermaid, index: number | null, parent: Parent<Node<Data>, Data>, config?: Config): Promise<OutputResult> => {
  const value = await renderToSvg(`mermaid-svg-${index}`, node.value, config && config.mermaid ? config.mermaid : {},
    config?.svgMermaidSrc ?? 'https://cdn.jsdelivr.net/npm/mermaid@9.3.0/dist/mermaid.min.js')
  const { fromHtml } = await import('hast-util-from-html')
  const { toEstree } = await import('hast-util-to-estree')
  const { toJs, jsx } = await import('estree-util-to-js')
  const { fromMarkdown } = await import('mdast-util-from-markdown')
  const { mdxjs } = await import('micromark-extension-mdxjs')
  const { mdxFromMarkdown } = await import('mdast-util-mdx')
  const { visit } = await import('estree-util-visit')
  const hast = fromHtml(value, {
    fragment: true,
    space: 'svg'
  })
  const estree = toEstree(hast)
  visit(estree, (node, key, index, ancestors) => {
    const jsxElement = node as JSXElement
    if (node.type === 'JSXElement' && (jsxElement.openingElement.name as JSXIdentifier).name === 'style') {
      const styleExpression = jsxElement.children[0] as JSXExpressionContainer
      const css = (styleExpression.expression as Literal).value as string
      const buffer = Buffer.from(css)
      const encoded = buffer.toString('base64')
      jsxElement.children = []
      jsxElement.openingElement.attributes.push({
        type: 'JSXAttribute',
        name: { type: 'JSXIdentifier', name: 'href' },
        value: { type: 'Literal', value: `data:text/css;base64,${encoded}` }
      },
        {
          type: 'JSXAttribute',
          name: { type: 'JSXIdentifier', name: 'rel' },
          value: { type: 'Literal', value: `stylesheet` }
        },
        {
          type: 'JSXAttribute',
          name: { type: 'JSXIdentifier', name: 'type' },
          value: { type: 'Literal', value: `text/css` }
        }
      );
      (jsxElement.openingElement.name as JSXIdentifier).name = 'link';
      jsxElement.openingElement.selfClosing = true
      jsxElement.closingElement = null
      const parent = ancestors[ancestors.length - 1] as any
      parent.children.splice(parent.children.indexOf(node), 1)
        ; (estree.body[0] as any).expression.children.push(node)
    }
  })
  const js = toJs(estree, { handlers: jsx })
  const tree = fromMarkdown(js.value.substring(2, js.value.length - 5), {
    extensions: [mdxjs()],
    mdastExtensions: [mdxFromMarkdown()]
  })
  return (tree.children[0] as MdastParent).children
}

const findInstances = (ast: any) => {
  const instances: [Literal, number, Parent<Node<Data> | Literal, Data>][] = []
  visit(ast, { type: 'code', lang: 'mermaid' }, (node: CodeMermaid, index, parent) => {
    instances.push([node, index!, parent as Parent<Node<Data>, Data>])
  })
  return instances
}

/**
 * mdx-mermaid plugin.
 *
 * @param config Config passed in from parser.
 * @returns Function to transform mdxast.
 */
export default function plugin(config?: Config) {
  /* istanbul ignore next */
  if (config?.output === 'svg') {
    return async function transformer(ast: any): Promise<Parent> {
      // Find all the mermaid diagram code blocks. i.e. ```mermaid
      let instances = findInstances(ast);

      // Replace each Mermaid code block with the Mermaid component
      // Here we iterate over the instances and replace them with the SVG
      // and run findInstances again to get the next set instances. We do this
      // because the replacement process can change the AST and cause
      // the indexes to be incorrect.
      while (instances.length > 0) {
        const [node, index, parent] = instances[0];
        const result = await outputSVG(node as any, index, parent, config);
        Array.prototype.splice.apply(parent.children, [index, 1, ...result]);
        instances = findInstances(ast);
      }
      return ast
    }
  }

  return function transformer(ast: any): Parent {
    // Find all the mermaid diagram code blocks. i.e. ```mermaid
    const instances = findInstances(ast)

    // Replace each Mermaid code block with the Mermaid component
    for (let i = 0; i < instances.length; i++) {
      const [node, index, parent] = instances[i]
      /* istanbul ignore next */
      const passConfig = i == 0 ? config : undefined
      const result = outputAST(node as any, index, parent, passConfig);
      Array.prototype.splice.apply(parent.children, [index, 1, ...result])
    }
    return ast
  }
}

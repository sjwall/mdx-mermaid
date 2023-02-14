/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import { compile } from '@mdx-js/mdx'
import mermaid from './mdxast-mermaid'

import type { Config } from './config.model'

describe('mdxast-mermaid', () => {
  function compileMdx(mdx: string, config?: Config) {
    return compile(mdx, {
      outputFormat: 'program',
      remarkPlugins: [[mermaid, config]]
    })
  }

  test('No mermaid', async () => {
    const result = await compileMdx('# Heading 1\n\nNo Mermaid diagram :(')
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\",
    p: \"p\"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", _jsx(_components.p, {
      children: \"No Mermaid diagram :(\"
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
export default MDXContent;
`)
  })

  test('ast', async () => {
    const result = await compileMdx(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``, { output: 'ast' })
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\",
    mermaid: "mermaid"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), "\\n", _jsx(_components.mermaid, {
      config: "{\\"output\\":\\"ast\\"}",
      chart: "graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;"
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
export default MDXContent;
`)
  })

  test('multiple mermaid instances in svg don\'t clobber previous node', async () => {
    const result = await compileMdx(
      `## Framework AARRR

    Some content

    \`\`\`mermaid
    graph TD;
      A-->B;
    \`\`\`

    And some more:


    \`\`\`mermaid
    graph TD;
      A-->B;
    \`\`\``,
      { output: 'svg' }
    );
    expect(result.value).toContain('And some more');
  })
})



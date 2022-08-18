/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import { compile } from '@mdx-js/mdx'
import mermaid from './mdxast-mermaid'
import type mermaidAPI from 'mermaid/mermaidAPI';

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

  test('Basic', async () => {
    const result = await compileMdx(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", \"import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\", \"\\n\", \"<Mermaid chart={\`graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;\`} />\"]
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

  test('Existing import', async () => {
    const result = await compileMdx(`import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\n\n# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
import {Mermaid} from 'mdx-mermaid/lib/Mermaid';
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", \"import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\", \"\\n\", \"<Mermaid chart={\`graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;\`} />\"]
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

  test('Existing import from ts exports(without /lib)', async () => {
    const result = await compileMdx(`import { Mermaid } from 'mdx-mermaid/Mermaid';\n\n# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
import {Mermaid} from 'mdx-mermaid/Mermaid';
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", \"import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\", \"\\n\", \"<Mermaid chart={\`graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;\`} />\"]
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

  test('Other imports', async () => {
    const result = await compileMdx(`import { A } from 'a';\n\n# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
import {A} from 'a';
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", \"import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\", \"\\n\", \"<Mermaid chart={\`graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;\`} />\"]
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

  test('Other imports component', async () => {
    const result = await compileMdx(`import { A } from 'a';\n\n# Heading 1\n
<Mermaid chart={\`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;\`} />`)
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
import {A} from 'a';
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components), {Mermaid} = _components;
  if (!Mermaid) _missingMdxReference(\"Mermaid\", true);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", _jsx(Mermaid, {
      chart: \`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;\`
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
function _missingMdxReference(id, component) {
  throw new Error(\"Expected \" + (component ? \"component\" : \"object\") + \" \`\" + id + \"\` to be defined: you likely forgot to import, pass, or provide it.\");
}
`)
  })

  test('Other imports with other component', async () => {
    const result = await compileMdx(`import { A } from 'a';

# Heading 1

<A>Hi</A>

## Heading 2

<Mermaid chart={\`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;\`} />`)
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
import {A} from 'a';
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\",
    h2: \"h2\"
  }, props.components), {Mermaid} = _components;
  if (!Mermaid) _missingMdxReference(\"Mermaid\", true);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", _jsx(A, {
      children: \"Hi\"
    }), \"\\n\", _jsx(_components.h2, {
      children: \"Heading 2\"
    }), \"\\n\", _jsx(Mermaid, {
      chart: \`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;\`
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
function _missingMdxReference(id, component) {
  throw new Error(\"Expected \" + (component ? \"component\" : \"object\") + \" \`\" + id + \"\` to be defined: you likely forgot to import, pass, or provide it.\");
}
`)
  })

  test('Config', async () => {
    const result = await compileMdx(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
  \`\`\``, { mermaid: { theme: 'dark' as mermaidAPI.Theme } })
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", \"import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\", \"\\n\", \"<Mermaid chart={\`graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;\`} />\"]
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

  test('Config component', async () => {
    const result = await compileMdx(`# Heading 1\n
<Mermaid chart={\`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;\`} />`, { mermaid: { theme: 'dark' as mermaidAPI.Theme } })
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components), {Mermaid} = _components;
  if (!Mermaid) _missingMdxReference(\"Mermaid\", true);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", _jsx(Mermaid, {
      chart: \`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;\`
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
function _missingMdxReference(id, component) {
  throw new Error(\"Expected \" + (component ? \"component\" : \"object\") + \" \`\" + id + \"\` to be defined: you likely forgot to import, pass, or provide it.\");
}
`)
  })

  test('Mixed component and code block', async () => {
    const result = await compileMdx(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`
<Mermaid chart={\`graph TD;
    E-->F;
    E-->G;
    F-->H;
    G-->H;\`}/>`, { mermaid: { theme: 'dark' as mermaidAPI.Theme } })
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components), {Mermaid} = _components;
  if (!Mermaid) _missingMdxReference(\"Mermaid\", true);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", \"import { Mermaid } from 'mdx-mermaid/lib/Mermaid';\", \"\\n\", \"<Mermaid chart={\`graph TD;\\n    A-->B;\\n    A-->C;\\n    B-->D;\\n    C-->D;\`} />\", \"\\n\", _jsx(Mermaid, {
      chart: \`graph TD;
    E-->F;
    E-->G;
    F-->H;
    G-->H;\`
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
function _missingMdxReference(id, component) {
  throw new Error(\"Expected \" + (component ? \"component\" : \"object\") + \" \`\" + id + \"\` to be defined: you likely forgot to import, pass, or provide it.\");
}
`)
  })

  test('Basic ast', async () => {
    const result = await compileMdx(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``, {output: 'ast'})
    expect(result.value).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \"react/jsx-runtime\";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: \"h1\"
  }, props.components), {Mermaid} = _components;
  if (!Mermaid) _missingMdxReference(\"Mermaid\", true);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: \"Heading 1\"
    }), \"\\n\", _jsx(Mermaid, {
      chart: \`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;\`,
      config: {
        \"output\": \"ast\"
      }
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
function _missingMdxReference(id, component) {
  throw new Error(\"Expected \" + (component ? \"component\" : \"object\") + \" \`\" + id + \"\` to be defined: you likely forgot to import, pass, or provide it.\");
}
`)
  })
})

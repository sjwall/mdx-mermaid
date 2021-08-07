/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import { createCompiler } from '@mdx-js/mdx'
import mermaid from './mdxast-mermaid'

const mdxCompiler = createCompiler({
  remarkPlugins: [mermaid]
})

test('No mermaid', async () => {
  const result = await mdxCompiler.process('# Heading 1\n\nNo Mermaid diagram :(')
  expect(result.contents).toEqual("\n\n\nconst layoutProps = {\n  \n};\nconst MDXLayout = \"wrapper\"\nexport default function MDXContent({\n  components,\n  ...props\n}) {\n  return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\"MDXLayout\">\n    <h1>{`Heading 1`}</h1>\n    <p>{`No Mermaid diagram :(`}</p>\n    </MDXLayout>;\n}\n\n;\nMDXContent.isMDXComponent = true;")
})

test('Basic', async () => {
  const result = await mdxCompiler.process(`# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
  expect(result.contents).toEqual("import { Mermaid } from 'mdx-mermaid/Mermaid';\n\n\nconst layoutProps = {\n  \n};\nconst MDXLayout = \"wrapper\"\nexport default function MDXContent({\n  components,\n  ...props\n}) {\n  return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\"MDXLayout\">\n\n    <h1>{`Heading 1`}</h1>\n    <Mermaid chart={`graph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;`} mdxType=\"Mermaid\" />\n    </MDXLayout>;\n}\n\n;\nMDXContent.isMDXComponent = true;")
})

test('Existing import', async () => {
  const result = await mdxCompiler.process(`import { Mermaid } from 'mdx-mermaid/Mermaid';\n\n# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
  expect(result.contents).toEqual("import { Mermaid } from 'mdx-mermaid/Mermaid';\n\n\nconst layoutProps = {\n  \n};\nconst MDXLayout = \"wrapper\"\nexport default function MDXContent({\n  components,\n  ...props\n}) {\n  return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\"MDXLayout\">\n\n    <h1>{`Heading 1`}</h1>\n    <Mermaid chart={`graph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;`} mdxType=\"Mermaid\" />\n    </MDXLayout>;\n}\n\n;\nMDXContent.isMDXComponent = true;")
})

test('Other imports', async () => {
  const result = await mdxCompiler.process(`import { A } from 'a';\n\n# Heading 1\n
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``)
  expect(result.contents).toEqual("import { Mermaid } from 'mdx-mermaid/Mermaid';\nimport { A } from 'a';\n\n\nconst layoutProps = {\n  \n};\nconst MDXLayout = \"wrapper\"\nexport default function MDXContent({\n  components,\n  ...props\n}) {\n  return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\"MDXLayout\">\n\n\n    <h1>{`Heading 1`}</h1>\n    <Mermaid chart={`graph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;`} mdxType=\"Mermaid\" />\n    </MDXLayout>;\n}\n\n;\nMDXContent.isMDXComponent = true;")
})

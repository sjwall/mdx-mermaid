import fs from 'fs';
import { runSync, compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime.js';
import { renderToStaticMarkup } from 'react-dom/server.js';
import {Mermaid} from 'mdx-mermaid/lib/Mermaid'

(async () => {
    const mdxMermaid = await import('mdx-mermaid');

    const markdown = fs.readFileSync('./example.md', 'utf-8');

    const code = String(await compile(markdown, {
        outputFormat: 'function-body',
        remarkPlugins: [[mdxMermaid.default, {output: 'svg'}]],
    }));

    const { default: Content } = runSync(code, runtime);

    const html = renderToStaticMarkup(Content({components: {mermaid: Mermaid, Mermaid}}));

    console.log(html);
})();

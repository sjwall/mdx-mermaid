# mdx-mermaid: Plug and play Mermaid in MDX

Based off the answer [here](https://github.com/facebook/docusaurus/issues/1258#issuecomment-594393744) by unknown.

## Quick start with Docusaurus

Install `mdx-mermaid`

```bash
yarn add mdx-mermaid
```

Update `docusaurus.config.js`

```js
 presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          remarkPlugins: [require('mdx-mermaid')],
```

Use code blocks in `.md` or `.mdx` files:

````md
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

Use the component in `.mdx` files:

```jsx
import { Mermaid } from 'mdx-mermaid/Mermaid';

<Mermaid chart={`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`} />
```

## License

[MIT][license] © [Samuel Wall][author]

<!-- Definitions -->

[license]: https://github.com/remarkjs/remark/blob/main/license

[author]: https://samuelwall.co.uk
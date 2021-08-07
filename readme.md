# mdx-mermaid: Plug and play Mermaid in MDX

Use [Mermaid][mermaid] in `.mdx` files with ease.

Based off the answer [here][inspire] by unknown.

[![npm version](https://badge.fury.io/js/mdx-mermaid.svg)][npm]
[![GitHub license](https://img.shields.io/github/license/sjwall/mdx-mermaid)][license]

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

[license]: https://github.com/sjwall/mdx-mermaid/blob/main/license

[author]: https://samuelwall.co.uk

[npm]: https://www.npmjs.com/package/mdx-mermaid

[mermaid]: http://mermaid-js.github.io/mermaid/

[inspire]: https://github.com/facebook/docusaurus/issues/1258#issuecomment-594393744
---
sidebar_position: 1
---

# Tutorial

Setup mdx-mermaid.

## Installing

Use your preferred package manager to install.

```shell title=NPM
npm i mdx-mermaid mermaid
```

```shell title=Yarn
yarn add mdx-mermaid mermaid
```

```shell title=PNPM
pnpm add mdx-mermaid mermaid
```

:::danger

For Docusaurus use `@docusaurus/theme-mermaid@^2.3.1` and @mdxjs/mdx v1 use version `mdx-mermaid@^1.3.0`

:::

:::info

For @mdxjs/mdx v2 use version `mdx-mermaid@^2.0.0`

:::

## Configure

Configure the plugin:

```js
import mdxMermaid from 'mdx-mermaid'
import {Mermaid} from 'mdx-mermaid/lib/Mermaid'

{
  remarkPlugins: [[mdxMermaid.default, {output: 'svg'}]],
  components: {mermaid: Mermaid, Mermaid}
}
```

## Add a Diagram

Add a Mermaid diagram to a `.md` or `.mdx` file.

````md title="Example Mermaid diagram"
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

## Admire your diagram

Take the time to appreciate your diagram.

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

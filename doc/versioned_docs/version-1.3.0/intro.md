---
sidebar_position: 1
---

# Tutorial

Setup mdx-mermaid in Docusaurus.

## Installing

Use your preferred package manager to install.

```shell title=NPM
npm i mdx-mermaid@^1.3.0 mermaid
```

```shell title=Yarn
yarn add mdx-mermaid@^1.3.0 mermaid
```

```shell title=PNPM
pnpm add mdx-mermaid@^1.3.0 mermaid
```

## Configure in Docusaurus

Import the module and pass it to `remarkPlugins`:

```js title=docusaurus.config.js

async function createConfig() {
  const mdxMermaid = await import('mdx-mermaid')

  return {
    presets: [
      [
        'classic',
        {
          docs: {
            remarkPlugins: [mdxMermaid.default],
          }
        }
      ]
    ]
  }
}

module.exports = createConfig;
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

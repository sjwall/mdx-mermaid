---
sidebar_position: 1
---

# Tutorial

Setup mdx-mermaid in Docusaurus.

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

## Configure in Docusaurus

Add

```js
require('mdx-mermaid')
```

to `remarkPlugins`

```js title=docusaurus.config.js
presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          remarkPlugins: [require('mdx-mermaid')],
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

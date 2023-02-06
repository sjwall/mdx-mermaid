/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import plugin from './lib/mdxast-mermaid'
import { Config as mConfig } from './lib/config.model'
import { Mermaid as mMermaid, MermaidProps as mMermaidProps } from './lib/Mermaid'

declare module 'mdx-mermaid' {
  namespace mdxmermaid {
    export type Config = mConfig
    export type MermaidProps = mMermaidProps
    export type Mermaid = typeof mMermaid
  }
}
export default plugin

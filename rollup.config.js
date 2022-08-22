import typescript from '@rollup/plugin-typescript'

/** @type {import('rollup').RollupOptions} */
const createConfig = (path, x) => ({
  input: `src/${path}.ts${x ? 'x' : ''}`,
  output: [
    { format: 'esm', file: `lib/${path}.mjs` },
    {
      format: 'cjs', file: `lib/${path}.cjs`
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    typescript()
  ]
})

/** @type {import('rollup').RollupOptions[]} */
export default [
  createConfig('mdxast-mermaid'),
  createConfig('Mermaid', true)
]

import babel from '@rollup/plugin-babel';

export default {
    input: 'index.js',
    output: [
        { format: 'esm', file: 'dist/esm/index.mjs' },
    ],
    external: ['react', 'react-dom'],
    plugins: [
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-react'],
        }),
    ],
};

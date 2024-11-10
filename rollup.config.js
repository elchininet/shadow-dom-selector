import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-ts';
import terser from '@rollup/plugin-terser';

export default [
    {
        plugins: [
            ts(),
            terser({
                output: {
                    comments: false
                }
            })
        ],
        external: ['get-promisable-result'],
        input: 'src/index.ts',
        output: [
            {
                file: `dist/index.js`,
                format: 'cjs'
            },
            {
                file: `dist/esm/index.js`,
                format: 'es'
            }
        ]
    },
    {
        plugins: [
            nodeResolve(),
            ts(),
            terser({
                output: {
                    comments: false
                }
            })
        ],
        input: 'src/index.ts',
        output: [
            {
                file: `dist/shadow-dom-selector-web.js`,
                format: 'iife',
                name: 'ShadowDomSelector'
            }
        ]
    }
];
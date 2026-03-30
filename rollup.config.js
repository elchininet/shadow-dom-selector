import packageJson from './package.json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import terser from '@rollup/plugin-terser';

export default [
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
                file: packageJson.exports['.'].require.default,
                format: 'cjs'
            },
            {
                file: packageJson.exports['.'].import.default,
                format: 'es'
            },
            {
                file: `dist/shadow-dom-selector-web.js`,
                format: 'iife',
                name: 'ShadowDomSelector'
            }  
        ]
    },
    {
        plugins: [
            tsConfigPaths(),
            dts()
        ],
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.exports['.'].require.types,
                format: 'cjs'
            },
            {
                file: packageJson.exports['.'].import.types,
                format: 'es'
            }
        ]
    }
];
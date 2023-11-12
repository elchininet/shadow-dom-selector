import ts from 'rollup-plugin-ts';
import serve from 'rollup-plugin-serve';

export default [
    {
        plugins: [
            ts(),
            serve({
                open: true,
                contentBase: 'tests/html',
                host: 'localhost',
                port: 3000,
            })
        ],
        input: 'tests/html-bundle.ts',
        output: [
            {
                file: 'tests/html/bundle.js',
                format: 'iife',
                name: 'DomSubtreeSelector'
            }
        ]
    },
    {
        plugins: [
            ts()
        ],
        input: 'src/index.ts',
        output: [
            {
                file: 'tests/html/dom-subtree-selector.js',
                format: 'iife',
                name: 'DomSubtreeSelector'
            }
        ]
    },
];
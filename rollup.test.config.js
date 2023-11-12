import ts from 'rollup-plugin-ts';
import serve from 'rollup-plugin-serve';

export default [
    {
        plugins: [
            ts()
        ],
        input: 'src/index.ts',
        output: [
            {
                file: 'demo/scripts/shadow-dom-selector.js',
                format: 'iife',
                name: 'ShadowDomSelector'
            }
        ]
    },
    {
        plugins: [
            ts(),
            serve({
                open: true,
                contentBase: [
                    'demo/',
                    'demo/scripts/'
                ],
                host: 'localhost',
                port: 3000,
            })
        ],
        input: 'demo/demo.ts',
        output: [
            {
                file: 'demo/scripts/demo.js',
                format: 'iife'
            }
        ]
    }
];
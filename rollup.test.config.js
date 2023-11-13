import ts from 'rollup-plugin-ts';
import serve from 'rollup-plugin-serve';
import istanbul from 'rollup-plugin-istanbul';

export default {
    plugins: [
        ts(),
        istanbul({
            exclude: [
                'demo/demo.ts',
                'node_modules/**/*'
            ]
        }),
        serve({
            open: false,
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
};
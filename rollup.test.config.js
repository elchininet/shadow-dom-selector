import ts from 'rollup-plugin-ts';
import serve from 'rollup-plugin-serve';

export default {
    plugins: [
        ts(),
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
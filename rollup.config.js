import {terser} from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const output = (input, file, plugins) => ({
    input,
    output: {
        name: 'ShpToGeoJson',
        file,
        format: 'es'
    },
    plugins
})

export default [
    output('./src/node/NodeShp.js', './dist/shp-to-geojson.node.js', [
        nodeResolve({preferBuiltins: true}), json(), commonjs()
    ]),
    output('./src/browser/BrowserShp.js', './dist/shp-to-geojson.browser.js', [
        nodeResolve({preferBuiltins: false}), commonjs()
    ]),
    output('./src/browser/BrowserShp.js', './dist/shp-to-geojson.browser.min.js', [
        nodeResolve({preferBuiltins: false}), commonjs(), terser(),
    ])
]

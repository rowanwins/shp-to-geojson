import {terser} from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const output = (input, file, plugins) => ({
    input,
    output: {
        name: 'ShpToGeoJson',
        file,
        format: 'umd'
    },
    plugins
})

export default [
    output('./src/node/NodeShp.js', './dist/shp-to-geojson.node.js', [
        nodeResolve(), commonjs()
    ]),
    output('./src/browser/BrowserShp.js', './dist/shp-to-geojson.browser.js', [
        nodeResolve({preferBuiltins: false}), commonjs()
    ]),
    output('./src/browser/BrowserShp.js', './dist/shp-to-geojson.browser.min.js', [
        nodeResolve({preferBuiltins: false}), commonjs(), terser(),
    ])
]

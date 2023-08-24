import test from 'ava'
import path from 'path'
import glob from 'glob'
import { fileURLToPath } from 'url'
import load from 'load-json-file'
import write from 'write-json-file'

import ShpToGeoJson from '../src/node/NodeShp.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const shpFiles = glob.sync(path.join(__dirname, 'harness', '*', '*.shp'))

test('fixtures', t => {

    shpFiles.forEach(async (filepath) => {
        const shp = new ShpToGeoJson({
            filePath: filepath
        })
        const geojson = shp.getGeoJson();

        const geojsonPath = filepath.replace('.shp', '.geojson')
        if (process.env.REGEN === 'true') write.sync(geojsonPath, geojson);
        const expected = load.sync(geojsonPath);
        t.deepEqual(geojson, expected, filepath)
    })
})

const polysPath = path.join(__dirname, '3k_polys', '3k_polys_4326.shp')

test('fixtures2', t => {

    const geojson = new ShpToGeoJson({
        filePath: polysPath
    }).getGeoJson();
    // console.log(geojson.features[0])
    const geojsonPath = polysPath.replace('.shp', '.geojson')
    if (process.env.REGEN === 'true') write.sync(geojsonPath, geojson);
    const expected = load.sync(geojsonPath);
    t.deepEqual(geojson, expected, polysPath)

})
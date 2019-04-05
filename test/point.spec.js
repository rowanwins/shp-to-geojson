import test from 'ava'
import path from 'path'

import {Shp} from '../src/main'

const shapefile = new Shp(path.join(__dirname, '/harness/Point/point.shp'))
const out = shapefile.convert()
const firstPoint = out.features[0]
const secondPoint = out.features[1]

test('Point test', t => {
    t.is(shapefile.shpType, 'Point')
    t.is(shapefile.recordCount, 2)
})

test('Point geojson check geometries', t => {
    t.is(out.type, 'FeatureCollection')
    t.is(out.features.length, 2)

    out.features.forEach(point => {
        t.is(point.geometry.type, 'Point')
    })

    t.is(firstPoint.geometry.coordinates[0], -0.260479041916168)
    t.is(firstPoint.geometry.coordinates[1], 0.03892215568862267)
    t.is(firstPoint.geometry.coordinates.length, 2)

    t.is(secondPoint.geometry.coordinates[0], -0.26047904217428336)
    t.is(secondPoint.geometry.coordinates[1], 0.03892215545036235)
    t.is(secondPoint.geometry.coordinates.length, 2)

})

test('Point geojson check properties', t => {
    t.is(firstPoint.properties.id, 1)
    t.is(secondPoint.properties.id, 2)
})

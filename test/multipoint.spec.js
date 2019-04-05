import test from 'ava'
import path from 'path'

import {Shp} from '../src/main'

const shapefile = new Shp(path.join(__dirname, '/harness/MultiPoint/multipoint.shp'))
const out = shapefile.convert()
const firstPoint = out.features[0]

test('MultiPoint test', t => {
    t.is(shapefile.shpType, 'MultiPoint')
    t.is(shapefile.recordCount, 1)
})

test('MultiPoint geojson check geometries', t => {
    t.is(out.type, 'FeatureCollection')
    t.is(out.features.length, 1)

    t.is(firstPoint.geometry.type, 'MultiPoint')

    t.is(firstPoint.geometry.coordinates[0][0], -0.7005988023952099)
    t.is(firstPoint.geometry.coordinates[0][1], -0.0239520958083832)

    t.is(firstPoint.geometry.coordinates[1][0], -0.08682634730538963)
    t.is(firstPoint.geometry.coordinates[1][1], 0.3532934131736527)
    t.is(firstPoint.geometry.coordinates.length, 2)
})

test('MultiPoint geojson check properties', t => {
    t.is(firstPoint.properties.id, 1)
})

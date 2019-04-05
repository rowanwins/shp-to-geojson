import test from 'ava'
import path from 'path'

import {Shp} from '../src/main'

const shapefile = new Shp(path.join(__dirname, '/harness/Point/point_with_z.shp'))

test('Point With Z test', t => {
    t.is(shapefile.shpType, 'PointZ')
    t.is(shapefile.recordCount, 1)
})

test('Point with Z convert', t => {
    const out = shapefile.convert()
    t.is(out.type, 'FeatureCollection')
    t.is(out.features.length, 1)

    out.features.forEach(point => {
        t.is(point.geometry.type, 'Point')
    })
    const firstPoint = out.features[0]
    t.is(firstPoint.geometry.coordinates[0], -0.06886227544910217)
    t.is(firstPoint.geometry.coordinates[1], 0.06586826347305386)
    t.is(firstPoint.geometry.coordinates[2], 0)
})

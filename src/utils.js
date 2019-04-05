import NullGeom from './NullGeom'
import Point from './Point'
import MultiPoint from './MultiPoint'
import {parseString, parseBoolean, parseNumber, parseDate} from './dbfParsers'

export const shpTypes = {
    0: {
        type: null,
        parser: NullGeom
    },
    1: {
        type: 'Point',
        parser: Point
    },
    11: {
        type: 'PointZ',
        parser: Point
    },
    8: {
        type: 'MultiPoint',
        parser: MultiPoint
    }
}

export const dbfTypes = {
    B: parseNumber,
    C: parseString,
    D: parseDate,
    F: parseNumber,
    L: parseBoolean,
    M: parseNumber,
    N: parseNumber
}

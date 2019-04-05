import Feature from './Feature'

export default class Point extends Feature {

    constructor (record, shpType) {
        super()

        this.geometry = {
            type: 'Point',
            coordinates: [record.readDoubleLE(4), record.readDoubleLE(12)]
        }

        if (shpType === 'PointZ') this.geometry.coordinates.push(record.readDoubleLE(20))
    }

}

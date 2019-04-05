import Feature from './Feature'

export default class MultiPoint extends Feature {

    constructor (record, shpType) {
        super()

        const numberPoints = record.readInt8(36)

        this.geometry = {
            type: 'MultiPoint',
            coordinates: []
        }

        let i = 40
        for (let j = 0; j < numberPoints; ++j, i += 16) {
            const outCoords = [record.readDoubleLE(i, true), record.readDoubleLE(i + 8, true)]
            if (shpType === 'MultiPointZ') outCoords.push(record.readDoubleLE(20))
            this.geometry.coordinates.push(outCoords)
        }

    }

}

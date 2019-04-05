import fs from 'fs'
import StringDecoder from 'string_decoder'

import {shpTypes, dbfTypes} from './utils'

const decoder = new StringDecoder.StringDecoder();

export class Shp {

    constructor (filepath) {
        this._shpBuffer = fs.readFileSync(filepath)

        const shpHeader = this._shpBuffer.slice(0, 100)

        const origType = shpHeader.readInt8(32)
        this.shpType = shpTypes[origType].type
        this.bbox = [shpHeader.readDoubleLE(36, true), shpHeader.readDoubleLE(44, true), shpHeader.readDoubleLE(52, true), shpHeader.readDoubleLE(60, true)];

        if (this.shpType === 'PointZ' || this.shpType === 'MultiPointZ' ||
            this.shpType === 'PolyLineZ' || this.shpType === 'PolygonZ') {
            this.bbox.push(shpHeader.readDoubleLE(68))
            this.bbox.push(shpHeader.readDoubleLE(76))
        }

        this._parser = shpTypes[origType].parser

        this.getDbfInfo(filepath)
    }

    getDbfInfo (filepath) {

        this._dbfBuffer = fs.readFileSync(filepath.replace('.shp', '.dbf'))
        const dbfHeader = this._dbfBuffer.slice(0, 32)

        this.recordCount = dbfHeader.readInt16LE(4)
        this._dbfRecordLength = dbfHeader.readUInt16LE(10)

        this.fields = []
        let fieldDescriptorPosition = 32

        for (fieldDescriptorPosition; this._dbfBuffer.readUInt8(fieldDescriptorPosition) !== 0x0d; fieldDescriptorPosition += 32) {
            const fieldInformation = this._dbfBuffer.slice(fieldDescriptorPosition, fieldDescriptorPosition + 32)
            const field = {
                name: (decoder.write(fieldInformation.slice(0, 11))  + decoder.end()).replace(/\0/g, '').trim(),
                dataType: String.fromCharCode(fieldInformation.readUInt8(11)),
                length: fieldInformation.readUInt8(16),
                decimal: fieldInformation.readUInt8(17)
            }
            field._parser = dbfTypes[field.dataType]

            this.fields.push(field)
        }
        this._dbfDataBuffer = this._dbfBuffer.slice(fieldDescriptorPosition + 1, this._dbfBuffer.length)
    }

    convert () {
        return {
            type: 'FeatureCollection',
            bbox: this.bbox,
            features: this._iterateRows()
        }
    }

    stream () {

    }

    _iterateRows () {
        let shpOffset = 100
        const len = this._shpBuffer.byteLength

        const outFeatures = []

        while (shpOffset < len) {
            const recordHeader = this._shpBuffer.slice(shpOffset, shpOffset + 8)
            const recordLength = recordHeader.readInt32BE(4) * 2
            const recordContents = this._shpBuffer.slice(shpOffset + 8, shpOffset + recordLength + 8)
            const feature = this._parseRow(recordContents)
            outFeatures.push(feature)
            shpOffset += 8
            shpOffset += recordLength
        }

        for (let i = 0; i < this.recordCount; i++) {
            const startPoint = i * this._dbfRecordLength + 1
            const dbfRowContents = this._dbfDataBuffer.slice(startPoint, startPoint + this._dbfRecordLength)
            outFeatures[i].properties = this._parseDbfRow(dbfRowContents)
        }

        return outFeatures
    }

    _parseRow (recordContents) {
        return new this._parser(recordContents, this.shpType)
    }

    _parseDbfRow (dbfRowContents) {
        const properties = {}

        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            const fieldData = dbfRowContents.slice(0, field.length)

            const data = (decoder.write(fieldData) + decoder.end()).replace(/\0/g, '').trim()
            properties[field.name] = field._parser(data)
        }
        return properties
    }

}

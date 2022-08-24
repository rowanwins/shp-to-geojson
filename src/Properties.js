export default class Properties {
    constructor (tableBuffer) {

        this.tableBuffer = tableBuffer
        this.properties = []

        this.tableHeaderLength = tableBuffer.readInt16LE(8)
        this.recordLength = tableBuffer.readInt16LE(10)

        const fieldDescriptors = tableBuffer.slice(32, this.tableHeaderLength - 2)
        let start = 0

        while (start < fieldDescriptors.length) {
            const field = fieldDescriptors.slice(start, start + 32)
            const fieldName = field.slice(0, 11).toString('utf8').replace(/[\u0000]+$/, '')
            const fieldLength = field.readUInt8(16)
            const fieldType = field.toString('utf8', 11, 15).replace(/[\u0000]+$/, '')
            this.properties.push({fieldName, fieldType, fieldLength})
            start += 32
        }
        this.numberProperties = this.properties.length
    }

    getRowProperties (index) {

        const recordStart = this.tableHeaderLength + (index * this.recordLength) + 1
        const outProperties = {}
        let usedFieldLength = 0
        for (let i = 0; i < this.numberProperties; i++) {
            const p = this.properties[i];
            const rowData = this.tableBuffer.toString('utf8', recordStart + usedFieldLength, recordStart + usedFieldLength + p.fieldLength).replace(/^\x20+|\x20+$/g, '')
            if (p.fieldType === 'N') {
                let v = Number(rowData)
                if (Number.isNaN(v)) v = null
                outProperties[p.fieldName] = v
            } else {
                outProperties[p.fieldName] = rowData
            }
            
            usedFieldLength += p.fieldLength
        }
        return outProperties
    }
}
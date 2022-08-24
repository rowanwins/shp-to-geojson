export default function createMultiPoint (recordContent) {
    const coordinates = []
    const numPoints = recordContent.readInt16LE(36)
    for (let i = 0; i < numPoints; i++) {
        coordinates.push([recordContent.readDoubleLE(36 + (16 * i) + 4), recordContent.readDoubleLE(36 + (16 * i) + 12)])
    }
    return {
        "type": "MultiPoint",
        "coordinates": coordinates
    }
}
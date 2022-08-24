export default function createPoint (recordContent, hasZ) {
    const p = {
        type: "Point",
        coordinates: [recordContent.readDoubleLE(4), recordContent.readDoubleLE(12)]
    }
    if (hasZ) p.coordinates.push(recordContent.readDoubleLE(20))
    return p
}
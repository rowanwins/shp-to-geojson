export default function createPolyline (recordContent, hasZ) {
    const coordinates = []

    const numParts = recordContent.readInt16LE(36)
    const numPoints = recordContent.readInt16LE(40)

    const startingIndices = []
    for (let i = 0; i < numParts; i++) {
        startingIndices.push(recordContent.readInt32LE(44 + 4 * i))
    }

    let totalVisited = 0
    const pointsSlice = recordContent.slice(44 + (4 * (numParts - 1)))
    let outPolylines = []

    for (let i = 0; i < startingIndices.length; i++) {
        const finishPoint = i === startingIndices.length - 1 ? numPoints : startingIndices[i + 1]
        const numPointsInRing = finishPoint - startingIndices[i]

        const line = []

        for (let ii = 0; ii < numPointsInRing; ii++) {
            const coords = [
                pointsSlice.readDoubleLE(totalVisited * 16 + 4),
                pointsSlice.readDoubleLE(totalVisited * 16 + 12)
            ]
            if (hasZ) coords.push(pointsSlice.readDoubleLE((totalVisited * 16) + 20))
            line.push(coords)
            totalVisited++
        }
        outPolylines.push(line)
    }
    const outType = outPolylines.length === 1 ? 'LineString' : 'MultiLineString'
    const outCoords = outPolylines.length === 1 ? outPolylines[0] : outPolylines
    const out = {
        type: outType,
        coordinates: outCoords
    }
    return out
}
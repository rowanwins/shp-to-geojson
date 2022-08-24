
export default function createPolygon (recordContent, hasZ) {

    const numParts = recordContent.readInt16LE(36)
    const numPoints = recordContent.readInt16LE(40)
    
    const startingIndices = []
    for (let i = 0; i < numParts; i++) {
        startingIndices.push(recordContent.readInt32LE(44 + 4 * i))
    }

    let totalVisited = 0
    const pointsSlice = recordContent.slice(44 + (4 * (numParts - 1)))

    let polygon = [calculateRing(0)]
    const multiPoly = [polygon]

    for (let i = 1; i < startingIndices.length; i++) {

        const ring = calculateRing(i)

        // Outer rings are clockwise
        if (ringClockwise(ring)) {
            polygon = [ring]
            multiPoly.push(polygon)
        } else { //This is a hole
            polygon.push(ring)
        }
    }

    return {
        type: multiPoly.length === 1 ? 'Polygon' : 'MultiPolygon',
        coordinates: multiPoly.length === 1 ? polygon : multiPoly
    }

    function calculateRing (i) {
        const finishPoint = i === startingIndices.length - 1 ? numPoints : startingIndices[i + 1]
        const numPointsInRing = finishPoint - startingIndices[i]
        const ring = []
        for (let ii = 0; ii < numPointsInRing; ii++) {
            const coords = [
                pointsSlice.readDoubleLE((totalVisited * 16) + 4),
                pointsSlice.readDoubleLE((totalVisited * 16) + 12)
            ]
            if (hasZ) coords.push(pointsSlice.readDoubleLE((totalVisited * 16) + 20))
            ring.push(coords)
            totalVisited++
        }
        return ring
    }

}


function ringClockwise (ring) {
    let sum = 0;
    let i = 1;
    let prev;
    let cur;
    const len = ring.length
    while (i < len) {
        prev = cur || ring[0];
        cur = ring[i];
        sum += ((cur[0] - prev[0]) * (cur[1] + prev[1]));
        i++;
    }
    return sum > 0;
  }
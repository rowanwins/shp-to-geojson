import Properties from './Properties.js'
import createPoint from './point.js'
import createPolyline from './polyline.js'
import createPolygon from './polygon.js'
import createMultiPoint from './multiPoint.js'
import {Buffer} from 'buffer'

export default class Shp {
    constructor (options) {
      this._options = options
      this._shpBuffer = null
      this._dbfBuffer = null
      this._projString = null
      this.loaded = false
      this._properties = null
      this._geomParser = null
      this._hasZ = false

      if (this._options.arraybuffers) {
        this._shpBuffer = Buffer.from(this._options.arraybuffers.shpBuffer)
        this._tableBuffer = Buffer.from(this._options.arraybuffers.dbfBuffer)
        this._projString = Buffer.from(this._options.arraybuffers.projString)
        this._init()
      }
    }

    load () {
      const that = this

      return new Promise((resolveLoad, rejectLoad) => {
        if (that._options.remotePath) {
          const shpPromise = this._loadFilePromise(that._options.remotePath)
          const dbfPromise = this._loadFilePromise(that._options.remotePath.replace('.shp', '.dbf'))
          const projPromise = this._loadFilePromise(that._options.remotePath.replace('.shp', '.prj'), 'text')
          // const qixPromise = this._loadFilePromise(that._options.remotePath.replace('.shp', '.qix'))

          Promise.all([shpPromise, dbfPromise, projPromise])
          .then((values) => {
            that._shpBuffer = Buffer.from(values[0])
            that._tableBuffer = Buffer.from(values[1])
            that._projString = values[2]
            that._init()
            that.loaded = true
            resolveLoad()
          })
          .catch(error => {
            rejectLoad(error)
          })

        } else {
          resolveLoad()
        }
      })
    }

    _loadFilePromise (filepath, responseType) {
      return new Promise((resolve, reject) => {
        fetch(filepath)
        .then(response => {
          if (response.ok) {
            if (responseType === 'text') return response.text()
            return response.arrayBuffer()
          } else {
            throw new Error(`Could not resolve ${filepath}`)
          }
        })
        .then(data => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    }

    _init () {
      this._properties = new Properties(this._tableBuffer)
      this._geomParser = this._setGeometryParser()
      this.loaded = true
    }

    get _shpGeometryType () {
        const geometryType = this._shpBuffer.readInt8(32)
        let out = null
        switch (geometryType) {
            case 1:
              out = 'Point'
              break;
            case 11:
              out = 'PointZ'
              break;
            case 21:
              out = 'PointM'
              break;
            case 3:
              out = 'PolyLine'
              break;
            case 13:
              out = 'PolyLineZ'
              break;
            case 23:
              out = 'PolyLineM'
              break;
            case 5:
              out = 'Polygon'
              break;
            case 15:
              out = 'PolygonZ'
              break;
            case 25:
              out = 'PolygonM'
              break;     
            case 8:
              out = 'MultiPoint'
              break;
            case 18:
              out = 'MultiPointZ'
              break;
            case 28:
              out = 'MultiPointM'
              break;
        }
        return out
    }

    get _bbox () {
        return [
            this._shpBuffer.readDoubleLE(36),
            this._shpBuffer.readDoubleLE(44),
            this._shpBuffer.readDoubleLE(52),
            this._shpBuffer.readDoubleLE(60)
        ]
    }

    get _numberOfFeatures () {
        return this._tableBuffer.readInt32LE(4)
    }

    get summary () {
        return {
            shpGeometryType: this._shpGeometryType,
            numberOfFeatures: this._numberOfFeatures,
            bbox: this._bbox,
            crs: this._projString
        }
    }

    _setGeometryParser () {
        const geometryType = this._shpBuffer.readInt8(32)
        if (geometryType === 11 || geometryType === 13 || geometryType === 15 || geometryType === 18) this._hasZ = true
        if (geometryType === 1 || geometryType === 11 || geometryType === 21) return createPoint
        if (geometryType === 3 || geometryType === 13 || geometryType === 23) return createPolyline
        if (geometryType === 5 || geometryType === 15 ||geometryType === 25) return createPolygon
        if (geometryType === 8 || geometryType === 18 || geometryType === 88) return createMultiPoint
    }

    getGeoJson () {    
        const out = {
            "type": "FeatureCollection",
            "bbox": this._bbox,
            "features": []
        }
        
        let start = 100
        let index = 0
        const bufferLength = this._shpBuffer.length
        while (start < bufferLength) {
            const headerLength = start + 8
            const recordLength = this._shpBuffer.readInt32BE(start + 4) << 1
            out.features.push({
                type: 'Feature',
                properties: this._properties.getRowProperties(index),
                geometry: this._geomParser(this._shpBuffer.slice(headerLength, headerLength + recordLength), this._hasZ)
            })
    
            start = headerLength + recordLength
            index++
        }
        return out
    }

    * streamGeoJsonFeatures () {
      let start = 100
      let index = 0
  
      while (start < this._shpBuffer.length) {
        const headerLength = start + 8
        const header = this._shpBuffer.slice(start, headerLength)
        const recordLength = header.readInt32BE(4) << 1
        yield {
            type: 'Feature',
            properties: this._properties.getRowProperties(index),
            geometry: this._geomParser(this._shpBuffer.slice(headerLength, headerLength + recordLength))
        }
        index++
        start = headerLength + recordLength

      }
  }
}

    
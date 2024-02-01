import 'cross-fetch/dist/node-polyfill.js'
import AdmZip from 'adm-zip'
import fs from 'fs'
import Shp from '../Shp.js'

export default class NodeShp extends Shp {
    constructor (options) {
      super(options)
      
      if (this._options.filePath) {
        const filepath = this._options.filePath
        this._shpBuffer = this._getArrayBufferFromFile(filepath)
        this._tableBuffer = this._getArrayBufferFromFile(filepath.replace('.shp', '.dbf'))
        this._projString = this._readStringFromFile(filepath.replace('.shp', '.prj'))
        this._init()

      } else if (this._options.filePathZipped) {
          const filepath = this._options.filePathZipped
          var unzippedfs = new AdmZip(filepath)

          const files = unzippedfs.getEntries()
          const shp = files.filter(f => f.entryName.includes('.shp'))[0]
          const dbf = files.filter(f => f.entryName.includes('.dbf'))[0]
          const proj = files.filter(f => f.entryName.includes('.prj'))[0]
          this._shpBuffer = shp.getData()
          this._tableBuffer = dbf.getData()
          this._projString = proj.toString('utf8')
          this._init()
        }
    }

    _getArrayBufferFromFile (filepath) {
      return fs.readFileSync(filepath)
    }

    _readStringFromFile (filepath) {
      return fs.readFileSync(filepath, 'utf-8')
    }
}

    
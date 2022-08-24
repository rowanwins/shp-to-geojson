import 'cross-fetch/dist/node-polyfill.js'
import zipper from 'zip-local'
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
          var unzippedfs = zipper.sync.unzip(filepath).memory()

          const fileNames = unzippedfs.contents()
          const shpName = fileNames.filter(f => f.includes('.shp'))[0]
          const dbfName = fileNames.filter(f => f.includes('.dbf'))[0]
          const projName = fileNames.filter(f => f.includes('.prj'))[0]

          this._shpBuffer = unzippedfs.read(shpName, "buffer")
          this._tableBuffer = unzippedfs.read(dbfName, "buffer")
          this._projString = unzippedfs.read(projName, "text")
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

    
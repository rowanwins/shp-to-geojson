import Shp from '../Shp'

export default class BrowserShp extends Shp {
    constructor (options) {
      super(options)

      if (options.filePath) {
        throw new Error('filePath is not a valid option in the browser. Either use remotePath or the arraybuffer options')
      } else if (options.filePathZipped) {
        throw new Error('filePathZipped is not a valid option in the browser. Either use remotePath or the arraybuffer options')
      }
    }
}

    
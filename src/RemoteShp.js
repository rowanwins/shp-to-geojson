export default class RemoteShp extends Shp {
  constructor(filepath) {
    super()
  }

  loadHeaders () {
    const that = this

    return new Promise((resolveLoad, rejectLoad) => {
      if (that._options.remotePath) {
        const shpPromise = this._loadFilePromise(that._options.remotePath)
        const dbfPromise = this._loadFilePromise(that._options.remotePath.replace('.shp', '.dbf'))
        const projPromise = this._loadFilePromise(that._options.remotePath.replace('.shp', '.prj'), 'text')
        const qixPromise = this._loadFilePromise(that._options.remotePath.replace('.shp', '.qix'))

        Promise.all([shpPromise, dbfPromise, projPromise, qixPromise])
        .then((values) => {
          that._shpBuffer = Buffer.from(values[0])
          that._tableBuffer = Buffer.from(values[1])
          that._projString = values[2]
          that._qixBuffer = Buffer.from(values[3])
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

}
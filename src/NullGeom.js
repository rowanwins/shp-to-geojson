import Feature from './Feature'

export default class NullGeom extends Feature {

    constructor () {
        super()
        this.geometry = null
    }

}

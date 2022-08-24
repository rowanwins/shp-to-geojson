
import Benchmark from 'benchmark'
import ShpToGeoJson from '../src/node/NodeShp.js'
import shapefile from 'shapefile'
import shpjs from 'shpjs'
import shp from 'shp'
import fs from 'fs'

const options = {
    onStart () { console.log(this.name) },
    onError (event) { console.log(event.target.error) },
    onCycle (event) { console.log(String(event.target)) },
    onComplete () {
        console.log(`- Fastest is ${this.filter('fastest').map('name')}`)
    }
}



// shp-to-geojson x 67.47 ops/sec ±3.61% (63 runs sampled)
// shpjs x 63.74 ops/sec ±2.83% (64 runs sampled)
// shapefile x 57.47 ops/sec ±7.71% (69 runs sampled)
// - Fastest is shp-to-geojson
// const harness = './test/harness/Polygon/CountriesMulti.shp'
// const suite = new Benchmark.Suite('Countries', options)
// suite
//     .add('shp-to-geojson', function () {
//         new ShpToGeoJson({
//             filePath: harness
//         }).getGeoJson()
//     })
//     .add('shpjs', function (){
//         shpjs.combine([
//             shpjs.parseShp(fs.readFileSync(harness)), 
//             shpjs.parseDbf(fs.readFileSync(harness.replace('.shp', '.dbf'))
//         )]);
//     })
//     .add('shapefile', {
// 		defer: true,
// 		fn: function (deferred) {
//             shapefile.read(harness)
//             .then(result => {
//                 deferred.resolve()
//             })
//         }
//     })
//     .run()


// 3k polygons
// shp-to-geojson x 12.42 ops/sec ±2.81% (35 runs sampled)
// shpjs x 4.54 ops/sec ±3.39% (16 runs sampled)
// shp x 12.41 ops/sec ±3.22% (35 runs sampled)
// shapefile x 1.06 ops/sec ±0.71% (10 runs sampled)
// - Fastest is shp-to-geojson,shp
const harness3 = './test/3k_polys/3k_polys_4326.shp'
const suite2 = new Benchmark.Suite('3k polygons', options)
suite2
    .add('shp-to-geojson', function () {
        new ShpToGeoJson({filePath: harness3}).getGeoJson()
    })
    .add('shpjs', function (){
        shpjs.combine([shpjs.parseShp(fs.readFileSync(harness3)), shpjs.parseDbf(fs.readFileSync(harness3.replace('.shp', '.dbf')))]);
    })
    .add('shp', function (){
        shp.readFileSync(harness3.replace('.shp',''))
    })
    .add('shapefile', function (deferred) {
        shapefile.read(harness3)
          .then(result => {
            deferred.resolve()
          })
    }, { defer: true })
    .run()

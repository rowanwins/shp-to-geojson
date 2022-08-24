## shp-to-geojson
- A small library for converting shapefiles to geojson
- Usable in both **node** and the **browser** (~30kb in the browser minified with all dependencies).
- Works with remote url's, filepaths (inc zipped) in node, or `arraybuffer`'s (eg for in drag-drop scenarios in the browser)
- Offers a streaming API as well, as a method to return the whole `FeatureCollection`.

### API
 
```
import ShpToGeoJson from 'shp-to-geojson'

// Loading From a FilePath in NodeJS
const shp = new ShpToGeoJson({
  filePath: "./test/points.shp"
})

// Get a GeoJson FeatureCollection
const featureCollection = shp.getGeoJson()

// Get a stream of features
const stream = shp.streamGeoJsonFeatures()
let featureIterator = stream.next()
while (!featureIterator.done) {
    const feature = featureIterator.value
    featureIterator = stream.next()
}
```

**More Usage Examples**
- Loading data from a Remote URL
- Streaming individual features 
- Zipped shp uploaded by the user in the browser (demonstrating the `shpBuffer` and `dbfBuffer` options)
- Reprojecting with proj4

#### Options

Option       | Description   | Example
------------ | ------------- | -------------
remotePath | A url to a `.shp` | https://someurl/points.shp
filePath | A filepath resolved in NodeJS using `fs.loadFile` | data/countries.shp
filePathZipped | A zipped file available in NodeJS | data/countries.zip
arraybuffers | An object containing `shpBuffer`, `dbfBuffer`, and `projString` keys | `{shpBuffer: new ArrayBuffer(), dbfBuffer: new ArrayBuffer(), projString: ''}`

#### Methods

Method       | Returns | Description 
------------ | ------------- | -------------
load | Promise | Required if loading using the `remotePath` option
getGeoJson | Geojson `FeatureCollection` | Returns a geojson `FeatureCollection` 
streamGeoJsonFeatures | Generator | Returns a js generator for iterating through features


#### Properties

Property       | Description
-------------- | -------------
summary | Returns the type of feature, number of features, bbox, and crs. Requires `.load()` to be have been called when using the `remotePath` option
loaded | Returns true/false whether the data has been loaded.


### Performance
This library appears to perform very well when there are lots of attributes compared to most other js libraries out there.
````
3,000 polygons with 40 attributes
shp-to-geojson x 13.68 ops/sec ±3.37% (39 runs sampled)
shpjs x 3.19 ops/sec ±2.75% (12 runs sampled)
shp x 10.60 ops/sec ±6.74% (31 runs sampled)
shapefile x 1.10 ops/sec ±3.14% (10 runs sampled)
- Fastest is shp-to-geojson
````
Note that the `shp` library while fast, it only works in NodeJS, and doesn't parse attributes nicely.

When there are minimal attributes this lib performs pretty similarly to other libs out there.
````
200 countries with a single attribute
shp-to-geojson x 67.47 ops/sec ±3.61% (63 runs sampled)
shpjs x 63.74 ops/sec ±2.83% (64 runs sampled)
shapefile x 57.47 ops/sec ±7.71% (69 runs sampled)
- Fastest is shp-to-geojson
````

### Motivations
1. I found the API's of some of the existing libraries pretty unintuitive
2. Some of them were only compatible with node (eg `shp`), I wanted something that worked in both browser and node with the same API
3. Some struggled with parsing attributes nicely (eg `shp`)
4. I wanted something that worked with z values.
5. I was intrigued to have a go at writing my first parsing library and getting experience with raw buffer data.


### Background Docs
- [Esri Shapefile Spec](https://www.esri.com/library/whitepapers/pdfs/shapefile.pdf)
- [DBF Material](http://www.dbase.com/Knowledgebase/INT/db7_file_fmt.htm)
- [More DBF Material](https://www.clicketyclick.dk/databases/xbase/format/dbf.html#DBF_NOTE_10_TARGET)

## Thanks
Thanks to creators/maintainers of other shapefiles parsers out there, I leaned on some of their buffer reading skills to grow my own understanding.
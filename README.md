My humble attempt at a shapefile to geojson converter in pure js.

### Motivation
There are already lots of shapefile parsing libraries out there (eg [shapefile](https://github.com/mbostock/shapefile) and [shp.js](https://github.com/calvinmetcalf/shapefile-js) so why undertake yet another...
- both have slightly complicated API's 
- Have variable support for z values

### API

##### Open File
````
const ShpToGeojson = require('shp-to-geojson')

const shp = new ShpToGeojson(filepath)
````

#### Convert to geojson
````
const geojson = shp.convert()
````

#### Stream features to geojson
````
shp.stream(function (feature) {
    console.log(feature)
})
````
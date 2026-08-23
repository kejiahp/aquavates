// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

var VERIFY_ONLY = true; // true = print checks only, queue no exports

// CHIRPS asset. 'UCSB-CHG/CHIRPS/DAILY' is v2.0 (0.05 deg, 1981-present).
// If CHIRPS v3 is in the catalog, swap the ID here and check the band name below.
var CHIRPS_ID = "UCSB-CHC/CHIRPS/V3/DAILY_SAT";
var RAIN_BAND = "precipitation";

// Administrative boundaries. FAO GAUL 2015 is the safe default in GEE.
// Alternative to try: 'WM/geoLab/geoBoundaries/600/UGA/ADM2' (newer vintage,
// splits Namisindwa out of Manafwa). Property name differs - see NAME_FIELD.
var ADMIN_ID = "FAO/GAUL/2015/level2";
var NAME_FIELD = "ADM1_NAME";
var COUNTRY_FIELD = "ADM0_NAME";
var COUNTRY = "Uganda";

var TARGET_DISTRICTS = [
  "BUTALEJA",
  "MBALE",
  "MANAFWA",
  "BUDUDA",
  "SIRONKO",
  "BUKWO",
  "KWEEN",
  "KAPCHORWA",
  "BULAMBULI",
];

var START_YEAR = 1981;
var END_YEAR = 2025;
var CHUNK_YEARS = 5; // years per export task; smaller = safer, more tasks

// Reduction scale in metres. CHIRPS native is ~5566 m. Using a finer scale makes
// Earth Engine evaluate sub-pixels, giving an area-weighted average rather than a
// pixel-centre one. This matters: Bududa and Mbale span only a handful of CHIRPS
// cells, and a pixel-centre reducer can return null for small polygons.
var SCALE = 1000;

var DRIVE_FOLDER = "CHIRPS_Elgon";

// ---------------------------------------------------------------------------
// DISTRICTS
// ---------------------------------------------------------------------------

var admin = ee
  .FeatureCollection(ADMIN_ID)
  .filter(ee.Filter.eq(COUNTRY_FIELD, COUNTRY));

// Uppercase the name field so matching is case-insensitive.
var adminUC = admin.map(function (f) {
  return f.set("NAME_UC", ee.String(f.get(NAME_FIELD)).toUpperCase().trim());
});

var districts = adminUC.filter(ee.Filter.inList("NAME_UC", TARGET_DISTRICTS));
var region = districts.geometry().bounds();

print(
  "All Uganda district names in " + ADMIN_ID,
  adminUC.aggregate_array("NAME_UC").sort(),
);
print(
  "Districts matched (expect " + TARGET_DISTRICTS.length + ")",
  districts.size(),
  districts.aggregate_array("NAME_UC").sort(),
);

Map.centerObject(districts, 8);
Map.addLayer(districts, { color: "red" }, "Target districts");

var chirps = ee
  .ImageCollection(CHIRPS_ID)
  .select(RAIN_BAND)
  .filterBounds(region);

print("CHIRPS images available", chirps.size());
print("First image date", ee.Image(chirps.first()).date().format("YYYY-MM-dd"));

var reducer = ee.Reducer.mean()
  .combine({ reducer2: ee.Reducer.max(), sharedInputs: true })
  .combine({ reducer2: ee.Reducer.min(), sharedInputs: true });

/**
 * Daily per-district statistics for a date range, as a flat FeatureCollection.
 */
function dailyStats(startDate, endDate) {
  var col = chirps.filterDate(startDate, endDate);

  return col
    .map(function (img) {
      var d = ee.Image(img).date().format("YYYY-MM-dd");

      var stats = ee.Image(img).reduceRegions({
        collection: districts,
        reducer: reducer,
        scale: SCALE,
        tileScale: 4, // raise to 8 or 16 if you hit memory errors
      });

      return stats.map(function (f) {
        return ee.Feature(null, {
          date: d,
          district: f.get("NAME_UC"),
          rain_mean: f.get("mean"),
          rain_max: f.get("max"),
          rain_min: f.get("min"),
        });
      });
    })
    .flatten();
}

// Property-name check. If rain_mean is null here, the combined reducer named its
// outputs differently (e.g. 'precipitation_mean'). Print the raw feature and adjust.
var sample = dailyStats("2022-04-01", "2022-04-03");
print("Sample output - confirm rain_mean is populated", sample.limit(5));

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

if (!VERIFY_ONLY) {
  for (var y = START_YEAR; y <= END_YEAR; y += CHUNK_YEARS) {
    var chunkEnd = Math.min(y + CHUNK_YEARS, END_YEAR + 1);
    var label = y + "_" + (chunkEnd - 1);

    Export.table.toDrive({
      collection: dailyStats(y + "-01-01", chunkEnd + "-01-01"),
      description: "chirps_daily_elgon_" + label,
      folder: DRIVE_FOLDER,
      fileNamePrefix: "chirps_daily_districts_" + label,
      fileFormat: "CSV",
      selectors: ["date", "district", "rain_mean", "rain_max", "rain_min"],
    });
  }
  print("Export tasks queued. Open the Tasks tab and run them.");
}

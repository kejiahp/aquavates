/**
 * Daily ERA5-Land temperature for the Mount Elgon districts, eastern Uganda.
 *
 * Paste into the Google Earth Engine Code Editor (code.earthengine.google.com).
 * Output columns: date, district, tmax_c, tmin_c, tmean_c
 * Joins to the CHIRPS rainfall CSVs on (date, district).
 *
 * Run order:
 *   1. VERIFY_ONLY = true. Check district count and that sample values look like
 *      Celsius (Mbale tmax ~25-30, not ~298).
 *   2. VERIFY_ONLY = false, run again, start the tasks in the Tasks tab.
 */

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

var VERIFY_ONLY = false;

// ERA5-Land daily aggregates. ~0.1 deg (~11 km), values in KELVIN.
// Aggregation is over the UTC calendar day.
var ERA5_ID   = 'ECMWF/ERA5_LAND/DAILY_AGGR';
var BAND_MAX  = 'temperature_2m_max';
var BAND_MIN  = 'temperature_2m_min';
var BAND_MEAN = 'temperature_2m';

var ADMIN_ID = "FAO/GAUL/2015/level2";
var NAME_FIELD = "ADM1_NAME";
var COUNTRY_FIELD = "ADM0_NAME";
var COUNTRY = "Uganda";

var TARGET_DISTRICTS = [
  'BUTALEJA', 'MBALE', 'MANAFWA', 'BUDUDA', 'SIRONKO',
  'BUKWO', 'KWEEN', 'KAPCHORWA', 'BULAMBULI'
];

var START_YEAR  = 1981;
var END_YEAR    = 2025;
var CHUNK_YEARS = 5;

// Finer than the native ~11132 m cell so reduceRegions returns an area-weighted
// value rather than sampling pixel centres. Needed because several of these
// districts are smaller than one ERA5-Land cell.
var SCALE = 1000;

var DRIVE_FOLDER = 'ERA5_Elgon';

// ---------------------------------------------------------------------------
// DISTRICTS
// ---------------------------------------------------------------------------

var adminUC = ee.FeatureCollection(ADMIN_ID)
  .filter(ee.Filter.eq(COUNTRY_FIELD, COUNTRY))
  .map(function (f) {
    return f.set('NAME_UC', ee.String(f.get(NAME_FIELD)).toUpperCase().trim());
  });

var districts = adminUC.filter(ee.Filter.inList('NAME_UC', TARGET_DISTRICTS));

print('Districts matched (expect ' + TARGET_DISTRICTS.length + ')',
      districts.size(), districts.aggregate_array('NAME_UC').sort());

Map.centerObject(districts, 8);
Map.addLayer(districts, {color: 'red'}, 'Target districts');

// ---------------------------------------------------------------------------
// ERA5-LAND
// ---------------------------------------------------------------------------

var era5 = ee.ImageCollection(ERA5_ID)
  .filterBounds(districts.geometry().bounds());

print('Band names - confirm the three temperature bands exist',
      ee.Image(era5.first()).bandNames());

/**
 * Per-district daily Tmax / Tmin / Tmean in Celsius.
 */
function dailyStats(startDate, endDate) {
  return era5
    .filterDate(startDate, endDate)
    .select([BAND_MAX, BAND_MIN, BAND_MEAN])
    .map(function (img) {
      var d = ee.Image(img).date().format('YYYY-MM-dd');

      var celsius = ee.Image(img).subtract(273.15)
        .rename(['tmax_c', 'tmin_c', 'tmean_c']);

      return celsius.reduceRegions({
        collection: districts,
        reducer: ee.Reducer.mean(),
        scale: SCALE,
        tileScale: 4
      }).map(function (f) {
        return ee.Feature(null, {
          date:     d,
          district: f.get('NAME_UC'),
          tmax_c:   f.get('tmax_c'),
          tmin_c:   f.get('tmin_c'),
          tmean_c:  f.get('tmean_c')
        });
      });
    }).flatten();
}

print('Sample output', dailyStats('2022-04-01', '2022-04-03').limit(10));

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

if (!VERIFY_ONLY) {
  for (var y = START_YEAR; y <= END_YEAR; y += CHUNK_YEARS) {
    var chunkEnd = Math.min(y + CHUNK_YEARS, END_YEAR + 1);
    var label = y + '_' + (chunkEnd - 1);

    Export.table.toDrive({
      collection:     dailyStats(y + '-01-01', chunkEnd + '-01-01'),
      description:    'era5land_daily_elgon_' + label,
      folder:         DRIVE_FOLDER,
      fileNamePrefix: 'era5land_daily_districts_' + label,
      fileFormat:     'CSV',
      selectors:      ['date', 'district', 'tmax_c', 'tmin_c', 'tmean_c']
    });
  }
  print('Export tasks queued. Open the Tasks tab and run them.');
}

// ---------------------------------------------------------------------------
// SANITY CHART
// ---------------------------------------------------------------------------

var mbale = districts.filter(ee.Filter.eq('NAME_UC', 'MBALE'));

print(ui.Chart.image.series({
  imageCollection: era5.filterDate('2022-01-01', '2023-01-01')
    .select([BAND_MAX, BAND_MEAN, BAND_MIN])
    .map(function (i) {
      return ee.Image(i).subtract(273.15)
        .rename(['tmax_c','tmean_c', 'tmin_c'])
        .copyProperties(i, ['system:time_start']);
    }),
  region: mbale.geometry(),
  reducer: ee.Reducer.mean(),
  scale: SCALE,
  xProperty: 'system:time_start'
}).setOptions({
  title: 'Mbale district - ERA5-Land daily Tmax and Tmin, 2022',
  vAxis: {title: 'deg C'}
}));
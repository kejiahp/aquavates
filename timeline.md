# Timeline

- Issue Rainfall Raster pixel Size: 4158.741271917808263,-4158.74127236842105
  - I had to make the catchement grid boxes bigger
- Combined Africa soil moisture does not fit into ESPG:32636
  - Now I have to reproject to EPSG:4326, clip out Uganda, reproject Uganda to ESPG:32636
  - With that done, I cap proceed with zonal analysis.
- Issue the soil mositure raster pixel size is: 27728.48820976440766,-27728.48820976440766
  - Deciding what to do?
- Work on the literature review.

# Thought Process

## To Grid the catchement for rainfall or not

Rainfall: catchment mean is the reasonable default, but it's a real choice, not forced. Rainfall at ~4 km genuinely resolves within-catchment variation, so unlike soil moisture, you could keep it gridded and engineer spatial features. Whether that's worth it depends on your model:

- If you're building a tabular model (one row per day, which is the typical first-pass flood model and what pairs naturally with a single daily soil-moisture value), then catchment-mean rainfall per day is the right call — and your short summary is correct.
- If you later go spatial (e.g. you want upstream-vs-downstream rainfall, or a model that consumes the grid), rainfall is where that detail actually lives, so you'd keep it gridded. Soil moisture still couldn't follow it there.

# Spatial vs Tabular Model

## Spatial Features

(a) your catchment is large/heterogeneous enough that where the rain falls changes flood response
(b) you plan spatially-aware features (upstream vs downstream, distance-weighted)
(c) you're going toward a CNN/spatial model rather than tabular.

# Conclusion

- If they start recording floods that could be integrated into the system more accuracy

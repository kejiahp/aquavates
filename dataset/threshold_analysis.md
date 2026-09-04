# Rainfall threshold for negative filtering

Empirically derived threshold on antecedent rainfall, used to restrict the
negative class of a daily flood-occurrence classifier for the Mount Elgon
districts. No model is trained here.

## 1. Data as found

**Flood labels** (`dataset/flood_labelled_data.csv`)

- 137 rows, 93 events, 7 districts
- Columns: Serial, Date (YMD), Day Index, Observation Date, District, Duration (d), Event Days, Duration Class
- Range: 1991-09-02 to 2018-06-20
- Duplicated district-days: 6

**Rainfall** (`dataset/chirps_daily_rainfall.csv`)

- 71,589 rows, 7 districts
- Range: 1998-01-01 to 2025-12-31
- `rain_mean`: min 0.00, max 65.38, mean 4.92 mm/day
- Nulls: 0; negative values: 0; duplicated district-days: 0

The rainfall file covers 7 districts and the labels 7. ** are excluded** — they were removed from the study area during label preprocessing as high-massif, landslide-dominated districts with 1-2 records each. Keeping their rainfall would add districts that can only ever contribute negatives.

Study area: BUDUDA, BULAMBULI, BUTALEJA, KAPCHORWA, MANAFWA, MBALE, SIRONKO

### Positives and the date screens

A positive is an event **onset** — `Day Index == 1` — giving 93 candidate positives from 137 labelled event-days. Later days of an event are not positives: their antecedent rainfall reflects a flood already in progress.

Month-precision screen, on the 85 distinct onset dates rather than the 93 rows (expected 2.79 dates per day-of-month, alpha 0.025):

- day 1: 8 distinct dates, p = 0.0069 — **flagged, excluded**
- day 15: 4 distinct dates, p = 0.3056 — not significant, retained

8 onsets fall on a flagged day. Their district-days are dropped from the panel rather than counted as negatives: if the date is month-precise the flood still happened that month, so the day is unknown rather than flood-free.

### Panel

- Overlapping range: 1998-01-01 to 2018-06-20
- District-days: 52,324 across 7 districts
- Positive days: 83
- Prevalence: **0.159%**
- Missing rainfall inside the panel: 0 — the rainfall record is a complete daily panel, so nothing is dropped, zero-filled or interpolated
- District-days removed as month-precise: 8

**2 onsets predate the rainfall record and are excluded:** 1991-09-02 MBALE, 1994-05-04 KAPCHORWA

## 2. Antecedent rainfall distributions

Rolling sums over [1, 2, 3, 5, 7, 15] days, computed within district groups sorted by date. Percentiles in mm:

| Window | Class | n | min | p1 | p5 | p10 | p25 | p50 | p75 |
|  --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1d | positive | 83 | 0.0 | 0.0 | 0.1 | 0.3 | 2.7 | 6.1 | 11.6 |
| 1d | negative | 52,241 | 0.0 | 0.0 | 0.0 | 0.0 | 0.5 | 2.7 | 7.0 |
| 2d | positive | 83 | 0.0 | 0.0 | 0.3 | 1.4 | 5.9 | 13.2 | 23.0 |
| 2d | negative | 52,234 | 0.0 | 0.0 | 0.0 | 0.0 | 1.6 | 6.8 | 14.5 |
| 3d | positive | 83 | 0.0 | 0.0 | 1.1 | 3.4 | 9.5 | 22.8 | 32.6 |
| 3d | negative | 52,227 | 0.0 | 0.0 | 0.0 | 0.1 | 3.1 | 11.1 | 22.0 |
| 5d | positive | 83 | 0.1 | 0.4 | 2.1 | 10.7 | 22.4 | 40.2 | 48.6 |
| 5d | negative | 52,213 | 0.0 | 0.0 | 0.0 | 0.6 | 7.0 | 20.3 | 36.4 |
| 7d | positive | 83 | 1.2 | 2.0 | 5.8 | 19.9 | 31.0 | 49.3 | 69.4 |
| 7d | negative | 52,199 | 0.0 | 0.0 | 0.2 | 1.6 | 12.0 | 29.8 | 50.3 |
| 15d | positive | 83 | 5.3 | 6.3 | 37.7 | 46.9 | 69.5 | 112.8 | 138.5 |
| 15d | negative | 52,143 | 0.0 | 0.1 | 2.8 | 10.1 | 36.1 | 68.4 | 103.9 |

## 3. Which window separates best

| Window | AUC | Positive median | Negative median | Median ratio |
| --- | --- | --- | --- | --- |
| 1d | 0.6636 | 6.1 | 2.7 | 2.26 |
| 2d | 0.6552 | 13.2 | 6.8 | 1.96 |
| 3d | 0.6770 | 22.8 | 11.1 | 2.06 |
| 5d | 0.6896 | 40.2 | 20.3 | 1.98 |
| 7d | 0.6841 | 49.3 | 29.8 | 1.65 |
| 15d | 0.7100 | 112.8 | 68.4 | 1.65 |

**Best window: 15 days**, AUC 0.7100. Selected on AUC, not assumed — 3 days is not the answer here.

Every window sits between 0.66 and 0.71, so antecedent rainfall is a **weak single discriminator at any horizon**. The median ratio moves the other way to AUC — it is highest at 1 day and lowest at 15 — because a long window raises both classes together.

## 4. Recommendation

**Threshold: 5.3 mm of 15-day antecedent rainfall**, applied to negatives only. Positives are never filtered.

- Positives retained: 83 of 83 (100.0%)
- Negatives removed: 3,616 of 52,143 (6.9%)
- Prevalence: 0.159% -> 0.171%
- Class ratio: **585:1**

### The data does not support a clean threshold

Stated plainly: the rule as specified — retain 99% of positives, reach a 30:1-100:1 class ratio — **cannot be satisfied by any rainfall threshold on this data.** At 99% retention the ratio is 585:1, roughly six times the top of the target band.

Two independent causes:

1. **Prevalence is far below the brief's estimate.** The task assumed ~280 flood records against ~80,000 district-days (0.2%). After reducing to onsets, restricting to the 7-district study area and excluding pre-1998 and month-precise dates, there are **83 positives against 52,143 negatives** — 0.159%. Reaching 100:1 from ~590:1 needs about 85% of negatives removed.
2. **Some flood days carry almost no antecedent rainfall.** The two lowest positives sit at 5.3 and 6.5 mm over 15 days, against a negative 5th percentile of 2.8 mm. A rule that must keep 99% of positives cannot raise the threshold past them.

What relaxing the retention rule would buy, on the 15-day window:

| Positive retention | Threshold (mm) | Positives dropped | Negatives removed | Ratio |
| --- | --- | --- | --- | --- |
| 99% | 5.3 | 0 | 3,616 (7%) | 585:1 |
| 98% | 6.5 | 1 | 4,091 (8%) | 586:1 |
| 95% | 37.4 | 4 | 13,448 (26%) | 490:1 |
| 90% | 46.4 | 8 | 16,820 (32%) | 471:1 |
| 75% | 66.8 | 20 | 25,363 (49%) | 425:1 |
| 50% | 112.8 | 41 | 41,544 (80%) | 252:1 |

**No retention level reaches 100:1.** Even discarding 41 of 83 positives — half the flood record — leaves 252:1.

### What to do instead

Keep the 5.3 mm filter. It costs no positives, removes 3,616 district-days on which a flood was not physically plausible, and is defensible: a day with almost no rain in the preceding fortnight is not a case the model should be asked to rule out. But it does not solve the imbalance, and should not be presented as if it does.

The imbalance needs a different instrument:

- **Class weights or focal loss** sized to the true ratio. Standard for rare-event classification, and discards nothing.
- **Negative subsampling** to a chosen ratio, stratified by season and district, keeping every positive — described as training-set construction, not data cleaning.
- **Threshold-free evaluation**: precision-recall AUC and the PR curve. At 0.16% prevalence accuracy and ROC-AUC are both misleading.

## 5. Positives at the low tail, for manual review

0 flood day(s) fall below the recommended 5.3 mm threshold. That is too few to review usefully, so the table lists the 12 onsets with the lowest 15-day antecedent rainfall — the records that pin the threshold down, and the first a stricter rule would discard. **None are deleted.**

Each is likely a label error, a date less precise than it looks, a non-rainfall trigger such as blocked drainage or an upstream release, or a local convective storm the gridded product smoothed away. A flood onset preceded by under 10 mm over a fortnight is not plausibly rainfall-driven.

| Date | District | 15-day antecedent (mm) | Same-day (mm) | Dropped at |
| --- | --- | --- | --- | --- |
| 2014-03-11 | MBALE | 5.3 | 1.33 | 98% |
| 2013-03-05 | MBALE | 6.5 | 0.13 | 95% |
| 2016-01-04 | SIRONKO | 16.9 | 0.00 | 95% |
| 2009-07-21 | BUTALEJA | 31.9 | 0.06 | 95% |
| 2010-01-15 | KAPCHORWA | 37.4 | 0.29 | 90% |
| 2006-07-14 | KAPCHORWA | 40.2 | 1.74 | 90% |
| 2010-09-29 | BUTALEJA | 42.2 | 5.03 | 90% |
| 2016-11-14 | BUTALEJA | 44.0 | 0.00 | 90% |
| 2017-04-10 | BULAMBULI | 46.4 | 0.73 | 75% |
| 1998-03-08 | MBALE | 49.1 | 2.14 | 75% |
| 2010-02-20 | BUTALEJA | 50.1 | 4.36 | 75% |
| 2013-10-25 | SIRONKO | 56.1 | 4.09 | 75% |

The top two are the binding constraint on the whole analysis. Both are MBALE, both in March, and both record under 7 mm across the preceding fortnight — worth checking against the original DesInventar comments before they are trusted as flood days.

## 6. Sensitivity

The recommendation against neighbouring thresholds:

| Threshold (mm) | Positives kept | Negatives removed | Prevalence % | Ratio | |
| --- | --- | --- | --- | --- | --- |
| 0.0 | 83/83 | 0 (0.0%) | 0.159 | 628:1 | |
| 2.6 | 83/83 | 2,521 (4.8%) | 0.167 | 598:1 | |
| 5.3 | 83/83 | 3,616 (6.9%) | 0.171 | 585:1 | **recommended** |
| 10.6 | 81/83 | 5,351 (10.3%) | 0.173 | 578:1 | |
| 21.2 | 80/83 | 8,460 (16.2%) | 0.183 | 546:1 | |

Nothing turns on the exact value. Quadrupling the threshold to 21.2 mm removes only a further 9% of negatives and still leaves the ratio above 500:1, while costing 3 positives. No setting in this range changes the conclusion — which is another way of saying rainfall is not doing much work here.

## Outputs

| File | Contents |
| --- | --- |
| `threshold_analysis.md` | This report |
| `antecedent_rainfall_distribution.png` | Distribution plot with the threshold marked |
| `src/scripts/empirical_rainfall_threshold.ipynb` | The notebook that produced both |

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

# 11th August 2026 - Progress

Due to the absence of actual labelled data, We decide to mock the labelling of actual flood occurence or not.

# 17th August 2026

Due to limited label flood data for just the Mbale district, I've decided to consider other Mount Elgon districts for flooding label data and include that into the training set.

> Rationale:
> Pooling the Mount Elgon districts is the decisive move, and it aligns directly with the source paper’s methodology—they merged twenty districts to reach roughly 3,000 rows. Bringing in Bududa, Sironko, Manafwa, Butaleja and Kapchorwa would realistically lift the dataset from 26 events to somewhere in the 80–130 range, while giving you a district field that matches the paper’s structure. Each district contributes its own extracted rainfall and temperature series, so you’re adding genuine observations rather than replicating Mbale’s. The trade‑off is that it broadens the scope we intentionally tightened two revisions ago. I think that trade is worth it: Mbale remains the centrepiece for the deployed service and evaluation, while the model trains on the wider Mount Elgon catchment. Replication fidelity is a clean, defensible rationale—and it calls for a scope paragraph, not a rewrite of the whole document.

**Desinventar**

[Desinventar — Uganda Flood Occurences](https://www.desinventar.net/DesInventar/profiletab.jsp?countrycode=uga&continue=y)

**EM-DATA**

- [EM-DAT](https://public.emdat.be)
- [EM-DAT Public Table](https://doc.emdat.be/docs/data-structure-and-content/emdat-public-table)

# 18th August 2026

Districts in eastern uganda I decided to include in the dataset are as follows.

- BUTALEJA
- MBALE
- MANAFWA
- BUDUDA
- SIRONKO
- BUKWO
- KWEEN
- KAPCHOPWA
- BULAMBULI

Column extracted from Desinventar
Serial, Date, Duration,Event, District, Subcounty, Parish, Location, Deaths,Comments,

## Pre-processing the DesInventar Dataset

Included EM-DAT dataset before pre-processing. Zero EM-DAT records collide with an existing DesInventar date+district, so no cross-source dedup conflict. EM-DAT also extends coverage to 2019–2025, which DesInventar lacks entirely (it stops at 2018).

Some entries in the Date (YMD) column lack have invalid dates e.g. 1933/0/0 or 2013/10/0. I want to count the number of rows with invalid data.

Result of preprocessing

```txt
Breakdown by category:
Date (YMD)
complete             223
month only            42
year only              4
day without month      2
```

## 1. Check for multi-district reports of the same storm

Check for multi-district reports of the same storm and collapse multi-district reports of the same storm.

## 2. Check for double entries

Report of the same event, on the same date, in the same district.

## 3. Expand each event to its full day span from the report,

Expand each event to its full day span from the report using `Date + Duration`, the output should be captured in the same df. The new total number of rows should be printed.

Create a new csv file of this date, columns to include are as follows: Date, District

## 4. Addressing flood duration spanning multiple months

**Decided to classify and cap date + duration expansions**

I've decided to cap the flood duration to 21 days. Using results from this article on flood durations [Recent trends in the frequency and duration of global floods](https://esd.copernicus.org/articles/9/757/2018/esd-9-757-2018.html) You don't have to read the article. They classifed flood durations into the following three classes (i.e., short: 1–7, moderate: 8–20, and long: 21 days and above)

So flood records that span multiple days like Mbale with 150 days should be capped to 21 data.

# 20th August 2026

We will be using CHIRPS V3 for daily rainfall data and

# 23th August 2026

## Removing EM-DAT from the flood labelled dataset

In the process of determining a threshold for rainfall that potentially contributes to flooding. I ran 1, 2, 3, 5, 7 and 15 days antecedent rainfall windows on check on the dataset and realised a large two of the six driest flood days are EM-DAT district attributions from the same event. 2019-12-18 KWEEN (0.15 mm over 3 days) and BUKWO (0.26 mm) both come from the 8-district national record — the one we capped at 2 days precisely because its footprint is asserted rather than observed.

I've already been skeptical of the EM-DAT dataset on the website the [page](https://doc.emdat.be/docs/introduction) there was no guarantee of correctness not accuracy. As a result, I've decided to drop EM-DAT and it's records completely from the result.

## Removing Bukwo, Kween from the flood labelled dataset and reducing they day expansion cap to 7 days.

Regarding BUKWO and KWEEN, let's remove these districts from the dataframe as they do not really contribute, adding to my reasoning to remove them, BUKWO and KWEEN sit high on the massif, so they are more landslide-prone than riverine-flood-prone, which doesn't really matter as our target is intended to be flood-only.

As for the expansion to day spans cap of 21 days. I want you to reduce that to 7 days as the rainfall data from CHIRPS doesn't shows the span is too large and includes days with little rainfall.

# CHIRPS & ERA5 dataset preprocessing

## CHIRPS dataset consolidation

Okay lets work on Chirps preprocessing again, I've cleared out the table.
First thing we will work on is merging the chirps rainfall datasets into a single rainfall csv. CHIRPS daily districts from 1996 to 2025 should be merged into a single csv.

For the duplicate dated MBALE records, this is because during extraction the uganda Mbale district was divided into two Mbale municipality and the general Mbale district (Mbale municipality is within the general Mbale district). Firstly check if you can differentiate between the two, If you can remove the Mbale municipality records from the dataset keeping only the general Mbale district as this already includes the municipality grid cells.

## Determine empirical threshold for negative removal

**Result**
Threshold: 5.3 mm of 15-day antecedent rainfall. Negative district-days below it were removed; positives were never filtered.

- Derived in empirical_rainfall_threshold.ipynb as the largest threshold retaining ≥99% of positives (it retained 100%).
- 15-day window chosen on AUC (0.710) over 1/2/3/5/7-day alternatives.
- Applied in chirps_preprocessing.ipynb: removed 3,621 of 52,105 negatives (6.9%), prevalence 0.232% → 0.249%, ratio 400:1.
- 88% of removals fell in December–January–February, since those are the dry months.

only negatives were removed. Flood days below 5.3 mm were kept — one was (2014-03-11 MBALE, 5.295 mm).

## CHIRPS class weights to fix Imbalance

# 25th August 2026

## EDA on the split training data before actual training

Spatial structure — Skipped this step
Per-district prevalence, rainfall and temperature climatology, and positives per district-year. Whether prevalence is uniform (it isn't — MBALE 26 positives, KAPCHORWA 8) determines whether district belongs in the model as a categorical, and whether per-district normalisation makes sense.

My reasoning: We already know it isn't but for simplicity we will keep it as categorical. I don't want to fix imbalances in the various 7 districts of interest.

## Training Models

### DNN

### LSTM

### Naive Bayes

### SVM

# Janusz Recommendation

Include other statistical models e.g. Support Vector Machine(SVM), Bayes Bayesian Model, KNN,Random Forest.

- Separate records for training and testing.
- Do some EDA on the rainfall and flooding datasets.
- Change the window of time to monthly or half-monthly, add soil moisture data.
  - Be cause of the lack of real data we will not be moving on to making a Model-as-a-Service.

## Issues with EM-DAT

EM-DAT's inclusion criteria will hurt you.

- An event only enters EM-DAT if it meets a threshold — broadly 10+ deaths, 100+ affected, a declared state of emergency, or an international assistance appeal.
- Ordinary damaging floods in Mbale that displace a few dozen households simply won't be there.

# 26th August 2026

Trained all the models poor precision to accuracy. I want to raise the model performance. The major issue with poor performance is the data at a daily resolution we have a total of 48,605 records with 121 flood units, ratio: 400:1.

## What we will do to improve performance

- Use a monthly or Half-monthly target

| Resolution | Units  | Flood units | Prevalence | Ratio |
| ---------- | ------ | ----------- | ---------- | ----- |
| day        | 48,605 | 121         | 0.25%      | 400:1 |
| week       | 7,469  | 83          | 1.11%      | 88:1  |
| half-month | 3,444  | 83          | 2.41%      | 40:1  |
| month      | 1,722  | 73          | 4.24%      | 22:1  |

Half-monthly lands at 40:1 — inside the 30:1–100:1 band we originally wanted and couldn't reach by filtering. You keep 83 of 121 flood units at weekly, 83 at half-monthly, 73 at monthly. It also dissolves the month-precise date problem, since a date wrong by a few days lands in the right fortnight.

That single change is why the paper's numbers look healthy: they worked monthly. Comparing your daily result against their monthly one was never like-for-like.

- Include soil moisture from TAMSAT into the dataset and see how it performs
- Restrict to 2005+. Costs 2 flood units, removes five reporting-artefact flood-free years.

# What they didn't do?

Four models, all as binary classifiers on the same dataset: a deep neural network, plus SVM, Naive Bayes and KNN as comparison baselines.

**The DNN**, which is the one they present as their contribution:

- Three inputs: rainfall, maximum temperature, minimum temperature
- Three hidden layers, ten neurons each
- One output layer, classifying flood occurrence as 1 or 0
- LeakyReLU activation in the hidden layers, Softmax at the output
- Trained for 10,000 epochs
- Weights adjusted by error backpropagation

They discuss ReLU at length in the theory section and justify it over sigmoid and tanh, then state LeakyReLU in the implementation, so the two sections do not quite line up.

**The baselines** are described only at the level of textbook theory. For KNN they mention k = √n as a starting point and cross validation to tune k, with Euclidean distance chosen over Manhattan, Chebyshev and cosine. For SVM and Naive Bayes they give the mathematics but no implementation parameters. Built with Python, using Keras, Pandas and NumPy.

**Data and evaluation.** About 3,000 monthly records from India Water Portal, covering ten districts each in Bihar and Odisha, 1990 to 2002. Metrics were accuracy, precision, recall, F1 and MCC. Results were reported twice: single-run tables, where the DNN reached 91.18% accuracy, and means over 20 runs, where the DNN averaged 89.71% against 87.86% for Naive Bayes, 87.05% for SVM and 86.25% for KNN.

**What they do not report**, which matters for your replication because each gap is somewhere you can improve:

- No train/test split ratio, and no validation set
- No mention of chronological splitting; the 20 averaged runs imply random splits, which leaks information in time series data
- No learning rate, optimiser, batch size or loss function
- No early stopping or regularisation, so 10,000 epochs on 3,000 rows carries a clear overfitting risk
- No hyperparameter search for the layer or neuron counts, which appear simply asserted
- Class imbalance explicitly not addressed, which they list as their own future work
- Month is discussed as important because of the monsoon, but the DNN takes only three inputs, so it appears to have been left out

So a faithful replication means three inputs, three hidden layers of ten neurons, LeakyReLU, softmax, backpropagation. Everything in the list above you will have to specify yourself, and each choice is worth a sentence of justification in Chapter 3 noting that the source paper is silent on it.

# Future improvements

As a replacement for district identity. This is the version I'd actually recommend. If you encode districts as nine dummy variables, your model can't generalise to any district it wasn't trained on, and with a small positive class those dummies will overfit badly. Swapping them for continuous physiographic descriptors — mean elevation, relief (max minus min), mean slope, district area — lets the model learn "steep high-relief terrain floods differently" rather than memorising "Bududa". For flood work, relief and slope will carry more signal than mean elevation anyway, so consider adding those to the extraction.

# Conclusion

- If they start recording floods that could be integrated into the system more accuracy

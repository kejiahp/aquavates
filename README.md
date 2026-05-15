# AquaVates (aqua - water, vates - prophet)

**MSc Project Proposal**

- Student Name: Morenikeji Elijah Popoola
- Student ID: 30121940

## Project Title

Real-time Flood Prediction and Early Warning Using Machine Learning Techniques in Eastern Uganda

## Problem Definition

Eastern Uganda, especially the Mt. Elgon region including Mbale, Bududa, Sironko, Bukedea, Kapchorwa, Butaleja, and Manafwa, experiences frequent and severe flooding due to a combination of heavy seasonal rainfall and river overflow, as documented in humanitarian and climate reports. Floods have repeatedly affected large populations, with up to 300,000 people impacted during major events and widespread concern about disease outbreaks in affected districts.

Climate assessments show that rainfall is increasing in intensity, especially in the Mt. Elgon region, and the number of days with >20 mm precipitation is rising, making floods more likely. Low‑lying areas such as Mbale and Butaleja are specifically identified as highly flood‑prone.

Recent flood seasons have affected over 600,000 people, with 1.5 million at risk, causing deaths, displacement, destruction of homes, and damage to roads, bridges, schools, and water systems (UNICEF, 2022).

## Project Description

This project reduces flood risk along the slopes of Mount Elgon in Eastern Uganda (Mbale, Butaleja, Mount Elgon) by implementing a Real-time flood prediction and warning Model-as-a-Service (MaaS).

## Project Aim

The intention of this project is to create a real-time predictive Machine Learning service which can accurately determine Flood risk status in Eastern Uganda (e.g. Mbale, Butaleja, Kampala, Gulu, essentially areas along the slopes Mount Elgon). Allowing the government along with the habitants of this region to execute appropriate measures mitigating potential disaster (Anticipation Hub, 2024).
The services will be easily deployable, platform independent, scalable and most importantly have a client facing API.

### Potential Improvement

Upon successful implementation and evaluation of the model. If the time-frame allows it, we would then embark on the implementation of low-cost rain-fall and river level sensors. This sensors could be situated in critical locations in Eastern Uganda, specifically along rivers like Sironko, Manafwa and along the slopes of Mt. Elgon (Nancy, 2024).

## Project Objectives

- **Analysis**: We will reasearch the major causes of Flooding in Eastern Uganda sourcing available historical datasets on rain fall, river levels, Climate change e.g. storms, all in association with the steep mountain slopes and their correlation to Flooding in the target regions.

  We will then look into various neural network models and algorithms (e.g. RNN, CNN, LSTM or Transformers) that could be trained on this data to create a real-time predictive model.

- **Development & Implementation**: Upon succesful review of past historical data and potential models, we would move on to Pre-Processing, EDA and Preliminary investigation of the sourced dataset, identifying variables strongly associated with flooding and training the models on these variables.
  - **Model Evaluation**: Next we would evaluate the performance of the prediction models using metrics such as mean absolute error (MAE), root mean, square error (RMSE), and Mean Absolute Percentage Error (MAPE).

  - **Model-as-a-Service**: The most performant model would be further developed to integrate with a client facing API built using the Python language and the FastAPI framework (or Java language and the Spring framework). All this would be done in a dockerized environment ensuring scalablity and easy deployment.

  - **Visualization Website**: A public facing website would be created allowing data visualization and analysis.

- **Testing & Evaluation**: Model evaluation (MAPE, MAE, RMSE), System testing (unit, integration, user testing), performance analysis, compare results with literature.

## Project Artefact

The artefact will be in the form of software it would include:

- Machine Learning Flood Prediction Model
- Client API (Backend Service)
- Website (Frontend Service)

In the event the timeframe allows further development:

- Rainfall sensors (Physical hardware)
- Water-level sensors (Physical hardware)

## Legal, Social, Ethical and Professional Issues

- **Social Issues**
  - Fairness in who benefits: Some communities may receive more protection than others, creating perceptions of inequality in flood‑risk management.

## 6. Commercial Risk

| Potential Commerical Risks              | Solutions                                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Model Infrastructure (e.g. Transformer) | Rely on university resources e.g. Game Development Rooms equipped with Nvidia RTX 5070 GPU's for model training and testing |
| Sensor development                      | Dr. Shiny Verghese proposed provisioning necessary devices and parts which might be necessary e.g. Arduino boards           |

## Project Plan

The table below is a simplified version of the Project Plan. Please refer to [this pdf](./Project_Plan%20_Gantt_Chart.pdf) attached for a more comprehensive version.

| Objective                                      | Description                                                                                                                                                                                      | Start Date      | End Date        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | --------------- |
| Literature review                              | Topic focused reasearch by reading paper's on this area of study and their various methodologies to arrive at solutions; extracting key details.                                                 | 1st May, 2026   | 15th May, 2026  |
| System Design & Methodology                    | Choose research methods, ML techniques to apply, datasets, evaluation metrics, plan data pipeline, design Client API (backend) and UI/UX for the wesite.                                         | 16th May, 2026  | 24th May, 2026  |
| Data Collection & Preparation - Implementation | Collect raw data, clean data, handle missing values, EDA, identify relationships, feature engineering, train/validation/test split                                                               | 25th May, 2026  | 25th June, 2026 |
| Model Development - Implementaion              | Implement baseline model, train initial models, hyperparameter tuning, compare algorithms, select final model                                                                                    | 25th May, 2026  | 25th June, 2026 |
| Software Development - Implementation          | Backend implementation, frontend development, integrate ML model into system, build APIs or pipelines, logging & monitoring                                                                      | 25th May, 2026  | 25th June, 2026 |
| Testing & Evaluation                           | Model evaluation (MAPE, MAE, RMSE), System testing (unit, integration, user testing), performance analysis, compare results with literature                                                      | 26th June, 2026 | 30th June, 2026 |
| Conclusion & Future Work                       | Conclude the project referencing Literature review, explore future improvements.                                                                                                                 | 1st July, 2026  | 5th July, 2026  |
| Potential Optional Enhancements                | Research/Development of low-cost rain-fall and river level sensors, prototype sensor hardware, build simple data‑collection firmware, test sensor accuracy, integrate sensor data into pipeline. | Optional        | Optional        |

## Supervisors

- **Proposed Supervisor (First choice): Shiny Verghese**

- **Proposed Supervisor (Second choice): Janusz Kulon**

## References

- Anticipation Hub. (2024) 'Anticipating floods in Uganda: reflections from the communities', _Anticipation Hub_, Available at: https://www.anticipation-hub.org/Documents/Case_Studies/Uganda_case_study_2024_FINAL.pdf (Accessed: 25 April 2026).

- Nancy, A. (2025) 'My view: Confronting Uganda's Flood Crisis - a call to action', _tndNews_, Available at: https://tndnewsuganda.com/2025/08/my-view-confronting-ugandas-flood-crisis-a-call-to-action (Accessed: 25 April 2026).

- UNICEF. (2022) 'UNICEF UGANDA FLOODS RESPONSE (Update #2)', _UNICEF_, Available at: https://www.unicef.org/media/125626/file/Uganda-Response-Report-No.2-Floods-12-August-2022.pdf (Accessed: 25 April 2026).

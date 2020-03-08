# Motiv.ai [![Python](https://img.shields.io/badge/-Dialogflow-orange)](https://github.com/topics/dialogflow) [![MongoDB](https://img.shields.io/badge/-MongoDB-4db33d)](https://github.com/topics/mongodb) [![Python](https://img.shields.io/badge/-Python-blue)](https://github.com/topics/python)

[Motiv.ai](https://devpost.com/software/motiv-ai) is a voice-powered AI that allows users to track habits and goals and provides motivational messages and positive reinforcement to keep them on track. It runs on both Alexa and Google Home devices, and was created during BCHacks 2020.

The project's stack is completely cloud based: the back end processing is made by Google Cloud Functions, the natural language processing is done by [Dialogflow](https://dialogflow.com/), and the data is stored in MongoDB. This led Motiv.ai to win the prize for the best use of Google Cloud, sponsored by Major League Hacking.

Motiv.ai's voice user interface was designed with [Voiceflow](https://www.voiceflow.com/), which allows the project to run on both Google and Amazon platforms.

In this repository, you will find the code for the Cloud Functions. Each folder contains one of the main three activities performed by the voice app.

## Code Structure

    .
    ├── add_task                  # Function to add new goals
    ├── update_task               # Function to update status of the current goals
    ├── get_daily                 # Function that gets a motivational summary of users' achievements
    └── README.md


## Deploying Motiv.ai

### Environment variables

Motiv.ai code follows best practices and uses environment variables instead of hardcoded variables. It is necessary to create an `.env.yaml` file that will contain those variables in order for the code to work.

That YAML file that will set up all the variables looks like the following:

```
MONGO_USER: User that has permission to read/write data to MongoDB Cluster
MONGO_PASSWORD: Password for MONGO_USER
MONGO_URL: URL to access MongoDB cluster
GOOGLE_APPLICATION_CREDENTIALS: private_key.json
DIALOGFLOW_PROJECT_ID: XXXXXX-XXXXXX, ID that can be obtained on Dialogflow's console
DIALOGFLOW_LANGUAGE_CODE: en
```

### Connecting to Dialogflow

For the Cloud Functions to connect to Dialogflow, it is necessary to obtain a private key in the JSON format. That key should be named `private_key.json`, and placed inside the directory for each function. When creating the Cloud Functions, that file will be deployed together with the functions. 

More information about how that file can be obtained is available at [Setting up authentication for Dialogflow](https://dialogflow.com/docs/reference/v2-auth-setup).

### Creating the Cloud Functions

After creating the `.env.yaml` file and placing `private_key.json` inside the folders, we are ready to create the Cloud Functions. For each of the `add_task`, `update_task`, and `get_daily` endpoints run the command: 

```
gcloud functions deploy endpoint_name --env-vars-file .env.yaml --trigger-http --runtime python37
```

These commands will create the endpoint that execute the `main.py` codes in the cloud. Now it is time to connect Voiceflow to our functions.

## Voiceflow and Dialogflow models

For the whole project to run, a Voiceflow project and a Dialogflow model are also necessary. Our team is currently working to make those two parts of Motiv.ai open.

## Authors

* [**Ivan Carvalho**](https://github.com/ivaniscoding)
* [**Matthew Currie**](https://devpost.com/mattscurrie)
* [**Sean Roarty**](https://github.com/sroarty)

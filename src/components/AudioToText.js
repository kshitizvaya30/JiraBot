const express = require("express");
const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });
const router = express.Router();
const Fs = require("fs");

const sdk = require("microsoft-cognitiveservices-speech-sdk");
const AITextGeneration = require("./AITextGeneration");
const AUDIO_FILE = "./assets/audio.wav";
const subscriptionKey = process.env.AZURE_SPEECH_KEY;
const serviceRegion = process.env.AZURE_SPEECH_REGION;

function AudioToText() {
  var config = {
    method: "post",
    url:
      "https://" +
      serviceRegion +
      ".api.cognitive.microsoft.com/sts/v1.0/issuetoken",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      const audioData = Fs.readFileSync(AUDIO_FILE);
      let accessToken = response.data;
      var data = audioData;
      var language = "en-US";

      var config = {
        method: "post",
        url:
          "https://" +
          serviceRegion +
          ".stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "audio/wav",
          Authorization: "Bearer " + accessToken,
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if (response.data.DisplayText != "") {
            AITextGeneration(response.data.DisplayText);
          } else {
            console.log("Empty Message");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = AudioToText;

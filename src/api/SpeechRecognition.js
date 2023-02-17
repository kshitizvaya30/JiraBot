//Converting Audio to text Using Azure Speech Services

const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');
require("dotenv").config();

const AUDIO_FILE = '../assets/audio.wav';

const subscriptionKey = process.env.AZURE_SPEECH_KEY;
const serviceRegion = process.env.AZURE_SPEECH_REGION;

// const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
// const audioConfig = sdk.AudioConfig.fromWavFileInput(AUDIO_FILE);

// const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

// recognizer.recognizeOnceAsync(result => {
//   console.log(`Transcription: ${result.text}`);
//   recognizer.close();
// }, error => {
//   console.error(error);
//   recognizer.close();
// });

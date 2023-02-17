const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("This Webhook is Setup");
});

//For Audio Download
const Fs = require("fs");
const Downloader = require("nodejs-file-downloader");

//for Converting Audio to Text
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const AUDIO_FILE = "./assets/audio.wav";
const subscriptionKey = process.env.AZURE_SPEECH_KEY;
const serviceRegion = process.env.AZURE_SPEECH_REGION;

// ------------------------------------------------------------------------------------------------------

//To verify Whatsapp business Token
app.get("/whatsapp", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  if (mode && token) {
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

// ------------------------------------------------------------------------------------------------------

app.post("/whatsapp", (req, res) => {
  let body_param = req.body;

  // console.log(JSON.stringify(body_param, null, 2));
  //   console.log(body_param.entry);
  //   console.log(body_param.entry[0].changes);
  //   console.log(body_param.entry[0].changes[0].value);
  //   console.log(body_param.entry[0].changes[0].value.messages[0]);

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0].type === "audio"
    ) {
      let phn_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let audio_id = body_param.entry[0].changes[0].value.messages[0].audio.id;
      //    console.log(phn_no_id);
      //    console.log(from);
      //    console.log(message_body);

      var config = {
        method: "get",
        url: "https://graph.facebook.com/v16.0/" + audio_id + "/",
        headers: {
          Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
        },
      };

      //Media Url From Whatsapp
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          const mediaUrl = response.data.url;

          //Media File Download
          var config = {
            method: "get",
            url: mediaUrl,
            headers: {
              Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
            },
            responseType: "stream",
          };

          axios(config)
            .then(function (response) {
              response.data.pipe(Fs.createWriteStream("./assets/audio.wav"));
              console.log("Audio File Downloaded");
              AudioToText();
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

// ------------------------------------------------------------------------------------------------------

// Converting Audio to text Using Azure Speech Services
const AudioToText = () => {
  var axios = require("axios");

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
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

// ------------------------------------------------------------------------------------------------------
//Generate Text From Open Ai
// generate an ticket for jira =




// ------------------------------------------------------------------------------------------------------

//Create a Jira Ticket

const JiraTicket = () => {
  var data = JSON.stringify({
    fields: {
      project: {
        key: "JIR",
      },
      summary: "New Ticket order flow broken aaa",
      issuetype: {
        name: process.env.JIRA_ISSUE_TYPE_NAME,
      },
    },
  });

  var config = {
    method: "post",
    url: process.env.JIRA_DOMAIN + "/rest/api/3/issue",
    headers: {
      "Content-Type": "application/json",
      // Authorization:
      //   "Basic ay52YXlhMzAxMjAxQGdtYWlsLmNvbTpBVEFUVDN4RmZHRjAzV3JhMnFPVVpyOHJVNVlLUUhTS1JBNjVHS3c4TTItbkZCdFU0VGxfRU1VVk1na0FtYTh1djUwWnVqSXJWeXdnZVZwaHpXSlEyeW1yUjNnbjhheEFrSWVCV2NOZklRMUhmYW1yeWpwbmsydnNpZlhnblFST2tKUjJVUDJ1OHBxeHp3Zlp6OUJhQTdmLXlpSTRsaWJKQ1hSbV9XbjdZWktpN1FwQU0wakw1SUk9NUFENEU3RUI=",
      // Cookie:
      //   "atlassian.xsrf.token=4b742fa4-d2c0-4ea9-aabb-b3b2183f7a24_a9572bf659387f42d50fdd55f96cfc64a89b75aa_lin",
    },
    auth: {
      username: process.env.ATLASSIAN_EMAIL,
      password: process.env.ATLASSIAN_API_TOKEN_KEY,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      console.log("Ticket Created");
    })
    .catch(function (error) {
      console.log(error);
    });
};
// JiraTicket();
// ------------------------------------------------------------------------------------------------------

// For Messages
// app.post("/whatsapp", (req, res) => {
//   let body_param = req.body;

//   console.log(JSON.stringify(body_param,null,2));
// //   console.log(body_param.entry);
// //   console.log(body_param.entry[0].changes);
// //   console.log(body_param.entry[0].changes[0].value);
// //   console.log(body_param.entry[0].changes[0].value.messages[0]);

//   if (body_param.object) {
//     if (
//       body_param.entry &&
//       body_param.entry[0].changes &&
//       body_param.entry[0].changes[0].value &&
//       body_param.entry[0].changes[0].value.messages
//     ) {
//       let phn_no_id =
//         body_param.entry[0].changes[0].value.metadata.phone_number_id;
//       let from = body_param.entry[0].changes[0].value.messages[0].from;
//       let message_body = body_param.entry[0].changes[0].value.messages[0].text.body;
//     //    console.log(phn_no_id);
//     //    console.log(from);
//     //    console.log(message_body);

//       axios({
//         method: "POST",
//         url:
//           "https://graph.facebook.com/v15.0/" +
//           phn_no_id +
//           "/messages?access_token=" +
//           process.env.WHATSAPP_ACCESS_TOKEN,
//         data: {
//           messaging_product: "whatsapp",
//           to: from,
//           text: {
//             body: "Hi ... i am kshitiz",
//           },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       });
//       res.sendStatus(200);
//     } else {
//       res.sendStatus(404);
//     }
//   }
// });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});

const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();    
const Fs = require("fs");
const  AudioToText = require("../components/AudioToText");


router.post("/whatsapp", (req, res) => {
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
                console.log("Audio Message Received");
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



module.exports = router;
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

//To verify Whatsapp business Token
app.get("/whatsapp", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  //   console.log(mode);
  //   console.log(challenge);
  //   console.log(token);

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/whatsapp", (req, res) => {
  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));
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
      let message_body =
        body_param.entry[0].changes[0].value.messages[0].text.body;
      //    console.log(phn_no_id);
      //    console.log(from);
      //    console.log(message_body);

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v15.0/" +
          phn_no_id +
          "/messages?access_token=" +
          process.env.WHATSAPP_ACCESS_TOKEN,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi ... i am kshitiz",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

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

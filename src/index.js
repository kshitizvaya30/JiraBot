const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const audioMessage = require("./routes/AudioMessage");
const audioToText = require("./components/AudioToText");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', audioMessage);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});

const axios = require("axios");
const JiraTicketCreation = require("./JiraTicketCreation");
require("dotenv").config({ path: __dirname + "/.env" });

function AITicketCreation(TicketText) {
  var data = JSON.stringify({
    model: "text-davinci-003",
    prompt:
      "generate an ticket for jira with Summary, Description, Assignee(default is none),Priority(default is low) " +
      TicketText,
    temperature: 1,
    max_tokens: 2000,
  });

  var config = {
    method: "post",
    url: "https://api.openai.com/v1/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPEN_AI_KEY,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.choices));
      if (response.data.choices) {
        JiraTicketCreation(response.data.choices[0].text);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = AITicketCreation;

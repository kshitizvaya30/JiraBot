const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });

function JiraTicketCreation(TicketInfo) {
  const fields = {};
  const lines = TicketInfo.split("\n");

  lines.forEach((line) => {
    const [fieldName, fieldValue] = line.split(":");
    if (fieldName && fieldValue) {
      fields[fieldName.trim()] = fieldValue.trim();
    }
  });
  console.log(":::::::::::::::: " + TicketInfo);
  console.log(fields);

  var data = JSON.stringify({
    fields: {
      project: {
        key: process.env.JIRA_PROJECT_KEY,
      },
      summary: fields.Summary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: fields.Description,
              },
            ],
          },
        ],
      },
      priority: {
        name: fields.Priority,
      },
      assignee: {
        name: fields.Assignee,
      },
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
}

module.exports = JiraTicketCreation;

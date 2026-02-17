const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, pSubject, pBody) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>Friend Request Notification</h1><p>${pBody}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Friend Request Notification: You have received a friend request from DevTinder. ${pBody}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `${pSubject}`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (pSubject, pBody) => {
  const sendEmailCommand = await createSendEmailCommand(
    "hanumesh.bg@fnhtechnologies.com",
    "hanumeshbg042@gmail.com",
    pSubject, 
    pBody
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
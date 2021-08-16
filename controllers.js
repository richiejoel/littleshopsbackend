const admin = require("firebase-admin");
const serviceAccount = require("./littleshops-e51d8-firebase-adminsdk-hwsvv-7c1640d7ba.json");

const DATABASE_URL = "https://littleshops-e51d8.firebaseio.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});

const sendPush = (req, res) => {
  if (!req.body.push) {
    return res.status(400).json({ msg: "You don't allowed permissions!!" });
  }

  if (!req.body.businessId) {
    return res.status(400).json({ msg: "Param required!!" });
  }

  if (!req.body.title && !req.body.messageBody) {
    return res.status(400).json({ msg: "Title and body required!!" });
  }

  sendNotificationEventCreation(
    req.body.title,
    req.body.messageBody,
    req.body.businessId
  );

  let response = {
    chiefId: req.body.businessId,
  };
  return res.status(201).json(response);
};

async function sendNotificationEventCreation(
  titleAlert,
  bodyAlert,
  businessId
) {
  console.log("Drivers license");
  try {
    var payload = {
      notification: { title: titleAlert, body: bodyAlert },
      data: { click_action: "FLUTTER_NOTIFICATION_ACTION", info: businessId },
    };
    console.log("All I want");
    console.log(payload);
    await admin.messaging().sendToTopic("Events", payload);
  } catch (error) {
    console.log(error);
    console.log("Dejavu");
  }
}

module.exports = { sendPush };

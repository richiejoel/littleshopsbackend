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

  if (!req.body.orderId) {
    return res.status(400).json({ msg: "Param required!!" });
  }

  if (!req.body.userLoggedId) {
    return res.status(400).json({ msg: "Param required userLoggedId!!" });
  }

  if (!req.body.title && !req.body.messageBody) {
    return res.status(400).json({ msg: "Title and body required!!" });
  }

  sendToDeviceNotification(
    req.body.title,
    req.body.messageBody,
    req.body.businessId,
    req.body.orderId
  );

  /*const validate = await validateCourier(
    req.body.userLoggedId,
    req.body.businessId
  );*/

  /*if (validate == true) {
    sendNotificationEventCreation(
      req.body.title,
      req.body.messageBody,
      req.body.businessId,
      req.body.orderId
    );
  } else {
    console.log("No se envio Push Notification");
  }*/

  let response = {
    chiefId: req.body.businessId,
  };
  return res.status(201).json(response);
};

async function validateCourier(userLoggedId, businessId) {
  const usersDb = admin.firestore().collection("users");
  const businessDb = admin.firestore().collection("business");

  const userLog = await usersDb.doc(userLoggedId).get();

  console.log("Role: " + userLog.id);
  console.log("Role: " + userLog.data()["role"]);

  const role = userLog.data()["role"];

  if (role != "COURIER") {
    return false;
  }

  const business = await businessDb.doc(businessId).get();
  console.log("Fake: " + business.data()["couriers"]);
  let couriers = business.data()["couriers"];
  for (i = 0; i < couriers.length; i++) {
    if (userLoggedId == couriers[i]) {
      return true;
    }
  }

  return false;
}

async function sendNotificationEventCreation(
  titleAlert,
  bodyAlert,
  businessId,
  orderId
) {
  console.log("Drivers license");
  try {
    var payload = {
      notification: { title: titleAlert, body: bodyAlert },
      data: {
        click_action: "FLUTTER_NOTIFICATION_ACTION",
        info: businessId,
        order: orderId,
      },
    };
    console.log("All I want");
    console.log(payload);
    await admin.messaging().sendToTopic("Events", payload);
  } catch (error) {
    console.log(error);
    console.log("Heather");
  }
}

async function sendToDeviceNotification(
  titleAlert,
  bodyAlert,
  businessId,
  orderId
) {
  console.log("Dejavu");
  const usersDb = admin.firestore().collection("users");
  const businessDb = admin.firestore().collection("business");
  const business = await businessDb.doc(businessId).get();
  console.log("Fake: " + business.data()["couriers"]);
  let couriers = business.data()["couriers"];
  const tokens = [];
  let userBusiness;
  for (i = 0; i < couriers.length; i++) {
    userBusiness = await usersDb.doc(couriers[i]).get();
    tokens.push(userBusiness.data()["token"]);
  }

  console.log(tokens);

  try {
    var payload = {
      notification: { title: titleAlert, body: bodyAlert },
      data: {
        click_action: "FLUTTER_NOTIFICATION_ACTION",
        info: businessId,
        order: orderId,
      },
    };
    console.log("All I want");
    console.log(payload);
    await admin.messaging().sendToDevice(tokens, payload);
  } catch (error) {
    console.log(error);
    console.log("Dejavu");
  }
}

module.exports = { sendPush };

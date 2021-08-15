var http = require("http");
var server = http.createServer();

const admin = require("firebase-admin");
const serviceAccount = require("./littleshops-e51d8-firebase-adminsdk-hwsvv-7c1640d7ba.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function mensaje(petic, resp) {
  resp.writeHead(200, { "content-type": "text/plain" });
  resp.write("Hola Mundo");
  resp.end();
}
server.on("request", mensaje);

server.listen(process.env.PORT || 3000, function () {
  console.log("La Aplicación está funcionando en el puerto 3000");
});

async function sendNotificationEventCreation() {
  try {
    var payload = {
      notification: { title: "FCM Little shops", body: "We are notification" },
      data: { click_action: "FLUTTER_NOTIFICATION_ACTION" },
    };

    await admin.messaging().sendToTopic("Events", payload);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendNotificationEventCreation };

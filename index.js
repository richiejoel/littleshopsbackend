//var http = require("http");
//var server = http.createServer();
const express = require("express");
const port = 3000;
const controller = require("./controllers");
const sendPush = controller.sendPush;

//initializations
const app = express();
//settings
app.set("port", process.env.PORT || 3000);
app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(`The API Notifications PUSH is running in port ${app.get("port")} `);
});

app.listen(port, () => {
  console.log(
    `The API Notifications PUSH is running in port ${app.get("port")} `
  );
});

app.post("/sendPush", sendPush);

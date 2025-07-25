const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const utils = require("./utils/schedule");
const accessMiddleware = require("./middlewares/access.middleware");

cron.schedule(
  "0 0 * * *",
  () => {
    console.log("Running at 00:00 AM schedules");
    utils.updateCredit();
  },
  {
    timezone: "Asia/Bangkok",
  }
);

app.use(cors());
app.use(express.json());
// app.use(accessMiddleware);
app.use("/api", routes);

module.exports = app;

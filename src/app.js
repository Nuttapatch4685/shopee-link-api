const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const utils = require("./utils/schedule");
const authMiddleware = require("./middlewares/auth.middleware");

cron.schedule(
  "0 13 * * *",
  () => {
    // console.log("Running at 00:00 schedules");
    console.log("Running at 01:00 PM schedules");
    utils.updateCredit();
  },
  {
    timezone: "Asia/Bangkok",
  }
);

app.use(cors());
app.use(express.json());
app.use(authMiddleware);
app.use("/api", routes);

module.exports = app;

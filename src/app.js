const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const utils = require("./utils/schedule");
const authMiddleware = require("./middlewares/auth.middleware");

cron.schedule("0 0 * * *", () => {
  utils.updateCredit();
});

app.use(cors());
app.use(express.json());
app.use(authMiddleware);
app.use("/api", routes);

module.exports = app;

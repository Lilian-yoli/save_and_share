require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, API_VERSION, FRONTEND_HOST } = process.env;
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerUserFile = require("./swagger/swagger_user.json");
const swaggerShareFile = require("./swagger/swagger_share.json");
const { resetSharedTimesJob } = require("./backend/cron/share_cron");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(
  "/doc-user",
  swaggerUi.serveFiles(swaggerUserFile),
  swaggerUi.setup(swaggerUserFile)
);
app.use(
  "/doc-share",
  swaggerUi.serveFiles(swaggerShareFile),
  swaggerUi.setup(swaggerShareFile)
);

// api route
app.use("/api/" + API_VERSION, [
  require("./backend/user/routes"),
  require("./backend/routes/share_route"),
]);

// Set up cron jobs
const cronJobs = [resetSharedTimesJob];
cronJobs.forEach((cronFn) => {
  cronFn();
});

// Error handler
// should optimize it later
app.use((err, req, res, next) => {
  if (err) {
    console.log({ errorHandler: err.stack });
    res.status(500).send("Internal Server Error.");
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

require("dotenv").config();
const log = require("npmlog");
const express = require("express");
const app = express();
const { PORT, API_VERSION, FRONTEND_HOST } = process.env;
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerUserFile = require("./swagger/swagger_user.json");
const swaggerShareFile = require("./swagger/swagger_share.json");
const swaggerChatFile = require("./swagger/swagger_chat.json");
const swaggerToolsFile = require("./swagger/swagger_tools.json");
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
app.use(
  "/doc-chat",
  swaggerUi.serveFiles(swaggerChatFile),
  swaggerUi.setup(swaggerChatFile)
);
app.use(
  "/doc-tools",
  swaggerUi.serveFiles(swaggerToolsFile),
  swaggerUi.setup(swaggerToolsFile)
);

// api route
app.use("/api/" + API_VERSION, [
  require("./backend/user/routes"),
  require("./backend/routes/share_route"),
  require("./backend/routes/chat_route"),
  require("./backend/routes/tools_route"),
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
    log.error("SERVER-ERROR", "Error message: %j", err.stack);
    res.status(500).send("Internal Server Error.");
  } else {
    next();
  }
});

// socket.io
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { socketCon } = require("./backend/controllers/socket_controller");
socketCon(io);

// TEMP: for testing
app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

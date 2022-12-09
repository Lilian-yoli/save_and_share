require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, API_VERSION, FRONTEND_HOST } = process.env;
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_user.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_HOST);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// api route
app.use("/api/" + API_VERSION, [require("./backend/user/routes")]);

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

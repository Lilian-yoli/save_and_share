require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, API_VERSION } = process.env;
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// api route
app.use("/api/" + API_VERSION,
  [
    require("./backend/user/routes") 
  ])


app.get('/', function (req, res) {
    res.send('Hello Belinda')
})

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});
require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = process.env;

app.get('/', function (req, res) {
    res.send('Hello Belinda')
  })

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
}); 
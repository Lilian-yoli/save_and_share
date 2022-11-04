require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, API_VERSION } = process.env;
const bodyParser = require("body-parser");
const cors = require("cors")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(cors({origin: '*'}));


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
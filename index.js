require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = process.env;
const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env;
const { Pool } = require("pg");

app.get('/', function (req, res) {
    res.send('Hello Belinda')
  })

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});


const connectDb = async () => {
  try {
      const pool = new Pool({
          user: PGUSER,
          host: PGHOST,
          database: PGDATABASE,
          password: PGPASSWORD,
          port: PGPORT
      });
      await pool.connect()
      const res = await pool.query('SELECT * FROM members')
      console.log({dbConnection: res})
      await pool.end()
  } catch (error) {
      console.log({pgdbConnect: error})
  }
} 

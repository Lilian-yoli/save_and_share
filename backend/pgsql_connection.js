require("dotenv").config();
const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env;
const { Pool } = require("pg");
const { promisify } = require("util")


const pgsqlConfig = {
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT
}


const pgsqlPool = new Pool(pgsqlConfig);

// TODO: do more research on connect DB
const connectDb = async (pgsqlPool) => {
    try {
        await pgsqlPool.connect()
        const res = await pgsqlPool.query('SELECT * FROM members')
        console.log({dbConnection: res})
        await pgsqlPool.end()
    } catch (error) {
        console.log({pgdbConnect: error})
    }
  } 
  
// connectDb(pgsqlPool);
pgsqlPool
.query('SELECT NOW()')
.then(result => console.log(result.rows[0]))
.catch(e => console.error(e.stack))

module.exports = {
    connectDb,
    pgsqlPool
}
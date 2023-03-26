const chai = require("chai");
const chaiHttp = require("chai-http");
const { server } = require("../../index");
const { NODE_ENV } = process.env;
const log = require("npmlog");
const { pgsqlPool } = require("./../pgsql_connection");

chai.use(chaiHttp);

const { expect } = chai;
const requester = chai.request(server).keepOpen();

const getAllTables = async () => {
  try {
    const tableSelectedSql =
      "SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public';";
    const tablesInfoFromDB = await pgsqlPool.query(tableSelectedSql);
    const tablesInfo = tablesInfoFromDB.rows;
    const allTables = tablesInfo.reduce((allTables, tableInfo) => {
      if (tableInfo.tablename !== "migrations") {
        allTables.push(tableInfo.tablename);
      }
      return allTables;
    }, []);
    return allTables;
  } catch (err) {
    log.error("TEST-ERROR", "Error message: %j", err.stack);
    throw err;
  }
};

const truncateTable = async (table) => {
  console.log({ truncateAllTables: "truncateAllTables" });
  await pgsqlPool.query("BEGIN");
  try {
    await pgsqlPool.query(`TRUNCATE TABLE ${table} CASCADE`);
    await pgsqlPool.query("COMMIT");
  } catch (error) {
    log.error("TEST-ERROR", "Error message: %j", error.stack);
    await pgsqlPool.query("ROLLBACK");
  }
};

const truncateAllTables = async (getAlltablesFn, truncateTableFn) => {
  const allTalbles = await getAlltablesFn();
  if (NODE_ENV === "test") {
    log.info("TEST", "NODE_ENV is %j", NODE_ENV);
    return allTalbles.map(async (table) => {
      await truncateTableFn(table);
    });
  } else {
    log.info("TEST", "NODE_ENV is %j", NODE_ENV);
  }
};

module.exports = {
  expect,
  requester,
  truncateAllTables,
  truncateTable,
  getAllTables,
};

const { pgsqlPool } = require("../pgsql_connection");
const log = require("npmlog");

const saveOrderToDb = async ({ prime, amount, member_id, plan_type }) => {
  try {
    const now = new Date();
    const orderInfoArr = [
      member_id,
      prime,
      "active",
      amount,
      false,
      plan_type,
      now,
      now,
    ];
    const insertedQuery =
      "INSERT INTO orders(member_id, prime, status, amount, paid, plan_type, created, updated) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
    const insertedResult = await pgsqlPool
      .query(insertedQuery, orderInfoArr)
      .then((result) => {
        return result.rows;
      });
    return insertedResult;
  } catch (error) {
    log.error("TOOLS-MODEL", "Error message: %j", error);
  }
};

const updatePaymentStatus = async (member_id) => {
  try {
    const updatedQuery = `UPDATE orders SET paid = 'true' where id = $1`;
    const updatedResult = await pgsqlPool
      .query(updatedQuery, [member_id])
      .then((result) => {
        return {
          command: result.command,
          rowCount: result.rowCount,
        };
      });
    return updatedResult;
  } catch (error) {
    log.error("TOOLS-MODEL", "Error message: %j", error);
  }
};

module.exports = {
  saveOrderToDb,
  updatePaymentStatus,
};

const { pgsqlPool } = require("../pgsql_connection");
const log = require("npmlog");

const saveOrderToDb = async ({ prime, amount, member_id, membership_type }) => {
  try {
    const now = new Date();
    const orderInfoArr = [
      member_id,
      prime,
      "active",
      amount,
      false,
      membership_type,
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
    throw error;
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
    throw error;
  }
};

const updateMemberType = async (memberTypeDataToDb) => {
  try {
    console.log("updateMembershipType");
    const {
      userId,
      memberType,
      shared_times,
      shared_limit_times,
      expiredDatetime,
      updated,
    } = memberTypeDataToDb;
    const updateQuery =
      "UPDATE member_types SET member_type = $1, shared_times = $2, shared_limit_times = $3, expired_datetime = $4, updated = $5 where user_id = $6 RETURNING user_id, member_type";
    const updatedResult = await pgsqlPool
      .query(updateQuery, [
        memberType,
        shared_times,
        shared_limit_times,
        expiredDatetime,
        updated,
        userId,
      ])
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    return updatedResult;
  } catch (error) {
    log.error("TOOLS-MODEL", "Error message: %j", error);
    throw error;
  }
};

module.exports = {
  saveOrderToDb,
  updatePaymentStatus,
  updateMemberType,
};

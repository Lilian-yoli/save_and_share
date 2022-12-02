const { pgsqlPool } = require("./../pgsql_connection");

const selectUserByEmail = async (email) => {
  try {
    const selectEmailQuery = "SELECT * from members where email = $1";
    const selectedResult = await pgsqlPool
      .query(selectEmailQuery, [email])
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    return selectedResult;
  } catch (error) {
    console.log({ checkUserInfo: error });
    throw error;
  }
};

// TODO: 1. use transaction to avoid race condition
// 2. replace promise to async await
const insertUserDataToDb = async (signUpDataToDb) => {
  try {
    console.log("insertUserDataToDb");
    const { tableData } = signUpDataToDb;
    const insertQuery =
      "INSERT INTO members (email, username, created, updated, provider, token_expired, access_token, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const insertedResult = await pgsqlPool
      .query(insertQuery, tableData)
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    return insertedResult;
  } catch (error) {
    console.log({ insertUserDataToDb: error });
    throw error;
  }
};

const insertUserMemberType = async (memberTypeDataToDb) => {
  try {
    console.log("insertUserMemberType");
    const insertQuery =
      "INSERT INTO member_types (user_id, member_type, shared_times, shared_limit_times, expired_datetime, created, updated) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const insertedResult = await pgsqlPool
      .query(insertQuery, memberTypeDataToDb)
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    return insertedResult;
  } catch (error) {
    console.log({ insertUserMemberType: error });
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
    console.log(error);
    throw error;
  }
};

module.exports = {
  insertUserDataToDb,
  selectUserByEmail,
  updateMemberType,
  insertUserMemberType,
};

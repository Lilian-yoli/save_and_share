const { pgsqlPool } = require("./../pgsql_connection");

// TODO: should use transaction to atomic this operation
const selectMemberInfoById = async (userId) => {
  try {
    const selectMemberTypeQuery =
      "SELECT member_type, shared_times, shared_limit_times, extract(epoch from expired_datetime) AS expired_datetime, updated from member_types where user_id = $1";
    const selectedResult = await pgsqlPool
      .query(selectMemberTypeQuery, [userId])
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    console.log(selectedResult);
    return selectedResult;
  } catch (error) {
    console.log({ checkUserInfo: error });
    throw error;
  }
};
// selectMemberInfoById(2);

const insertShareLaunchDataToDb = async (shareLaunchDataArray) => {
  try {
    const insertShareLaunchDataQuery =
      "INSERT INTO shared_foods(user_id, name, category, description, image, expiry_date, county, district, address, meet_up_datetime, total_portions, own_portions, price, created, updated, unit_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *";
    const insertedResult = await pgsqlPool
      .query(insertShareLaunchDataQuery, shareLaunchDataArray)
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    console.log(insertedResult);
    return insertedResult;
  } catch (error) {
    console.log({ insertShareLaunchDataToDb: error });
    throw error;
  }
};

const updateMemberTypeInfo = async (userId) => {
  try {
    const updateMemberTypeQuery =
      "UPDATE member_types SET shared_times = shared_times + 1, updated = NOW() WHERE user_id = $1 RETURNING shared_times;";
    const updatedResult = await pgsqlPool
      .query(updateMemberTypeQuery, [userId])
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    console.log(updatedResult);
    return updatedResult;
  } catch (error) {
    console.log({ updateMemberTypeInfo: error });
    throw error;
  }
};

const updateDailyShareTimesTo0 = async () => {
  try {
    const updateDailyShareTimesTo0Query =
      "UPDATE member_types SET shared_times = 0, updated = NOW();";
    const updatedResult = await pgsqlPool
      .query(updateDailyShareTimesTo0Query)
      .then((result) => {
        return result.rowCount;
      })
      .catch((e) => console.error(e.stack));
    console.log(updatedResult);
    return updatedResult;
  } catch (error) {
    console.log({ updateDailyShareTimesTo0: error });
    throw error;
  }
};

// updateDailyShareTimesTo0();

module.exports = {
  selectMemberInfoById,
  insertShareLaunchDataToDb,
  updateMemberTypeInfo,
  updateDailyShareTimesTo0,
};

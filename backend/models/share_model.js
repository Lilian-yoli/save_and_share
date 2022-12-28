const { pgsqlPool } = require("./../pgsql_connection");
const log = require("npmlog");

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
      "INSERT INTO shared_foods(user_id, name, category, description, image, expiry_date, county, district, address, meet_up_datetime, total_portions, price, created, updated, unit_description, latitude, longitude, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *";
    const insertedResult = await pgsqlPool
      .query(insertShareLaunchDataQuery, shareLaunchDataArray)
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    console.log(insertedResult);
    return insertedResult;
  } catch (error) {
    log.error({ insertShareLaunchDataToDb: error });
    throw error;
  }
};

const insertOwnPortionsToMatchedShare = async (ownPortionsDataArray) => {
  try {
    console.log({
      insertOwnPortionsToMatchedShare: insertOwnPortionsToMatchedShare,
    });
    const insertOwnPortionsQuery =
      "INSERT INTO matched_share(share_id, participant_id, status, taken_portions, created, updated) VALUES ($1, $2, $3, $4, $5, $6)";
    const insertedResult = await pgsqlPool
      .query(insertOwnPortionsQuery, ownPortionsDataArray)
      .then((result) => {
        return result.rows;
      })
      .catch((e) => console.error(e.stack));
    console.log(insertedResult);
    return insertedResult;
  } catch (error) {
    log.error({ insertOwnPortionsToMatchedShare: error });
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

const selectSharesBySearchInfo = async ({
  name,
  category,
  county,
  district,
}) => {
  try {
    log.info("SHARE-MODEL", "Begin of the function selectSharesBySearch");
    const selectSharesBySearchInfoQuery =
      "SELECT id, name, description, expiry_date, meet_up_datetime FROM shared_foods WHERE name LIKE '%' || $1 || '%' AND category = $2 AND county = $3 AND district = $4 AND expiry_date > NOW()";
    const selectedResult = await pgsqlPool
      .query(selectSharesBySearchInfoQuery, [name, category, county, district])
      .then((result) => {
        return result.rows;
      })
      .catch((e) => log.error("SHARE-MODEL", "Error message: %j", e.stack));
    console.log({ selectedResult: selectedResult });
    return selectedResult;
  } catch (error) {
    log.error("SHARE-MODEL", "Error message: %j", error);
    throw error;
  }
};

module.exports = {
  selectMemberInfoById,
  insertShareLaunchDataToDb,
  insertOwnPortionsToMatchedShare,
  updateMemberTypeInfo,
  updateDailyShareTimesTo0,
  selectSharesBySearchInfo,
};

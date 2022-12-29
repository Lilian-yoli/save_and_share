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
    const selectSharesBySearchInfoQuery = `WITH ms_info AS 
      (SELECT share_id, SUM(taken_portions) AS total_taken_portions 
       FROM matched_share GROUP BY share_id)
       SELECT sf.id, sf.name, sf.description, TO_CHAR(sf.expiry_date, 'yyyy-mm-dd') AS expiry_date, 
       sf.meet_up_datetime, sf.price, sf.unit_description, sf.total_portions, ms.total_taken_portions::int
       FROM shared_foods sf LEFT JOIN ms_info ms ON sf.id = ms.share_id
       WHERE sf.name LIKE '%' || $1 || '%' AND sf.category = $2 AND sf.county = $3 
       AND sf.district = $4 AND sf.meet_up_datetime > NOW();`;
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

const selectShareById = async ({ share_id }) => {
  try {
    console.log({ selectShareById: "selectShareById" });
    const selectShareByIdQuery = `WITH ms_info AS 
      (SELECT share_id, SUM(taken_portions) AS total_taken_portions 
       FROM matched_share GROUP BY share_id)
      SELECT sf.id, sf.user_id, sf.total_portions, ms.total_taken_portions::int
      FROM shared_foods sf LEFT JOIN ms_info ms ON sf.id = ms.share_id
      WHERE sf.id = $1 AND NOW() <= sf.meet_up_datetime;`;
    const selectedResult = await pgsqlPool
      .query(selectShareByIdQuery, [share_id])
      .then((result) => {
        console.log({ selectedResult: result.rows });
        return result.rows;
      })
      .catch((e) => log.error("SHARE-MODEL", "Error message: %j", e.stack));
    return selectedResult;
  } catch (error) {
    log.error("SHARE-MODEL", "Error message: %j", error);
    throw error;
  }
};

const insertShareJoinToDb = async (shareJoinDataToDb) => {
  try {
    console.log({ insertShareJoinToDb: "insertShareJoinToDb" });
    const insertShareJoinToDbQuery =
      "INSERT INTO matched_share(share_id, participant_id, taken_portions, created, updated, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING share_id, status";
    const insertedResult = await pgsqlPool
      .query(insertShareJoinToDbQuery, shareJoinDataToDb)
      .then((result) => {
        console.log({ insertedResult: result.rows });
        return result.rows;
      })
      .catch((e) => log.error("SHARE-MODEL", "Error message: %j", e.stack));
    return insertedResult;
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
  selectShareById,
  insertShareJoinToDb,
};

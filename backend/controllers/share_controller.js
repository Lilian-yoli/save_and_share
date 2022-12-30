const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
const {
  shareLaunchSchema,
  shareSearchSchema,
  shareJoinSchema,
} = require("../schemas/share_schema");
const {
  selectMemberInfoById,
  insertShareLaunchDataToDb,
  updateMemberTypeInfo,
  selectSharesBySearchInfo,
  insertOwnPortionsToMatchedShare,
  selectShareById,
  insertShareJoinToDb,
  getShareDetailInfo,
  getPersonalLaunchInfo,
  getPersonalJoinedInfo,
  inactivateLaunchShareInfo,
  inactivateJoinedShareInfo,
} = require("../models/share_model");
addFormats(ajv, {
  mode: "fast",
  formats: ["date-time"],
  keywords: true,
});
const { validateInputData, timestampToDate } = require("../utils");

const shareLaunchFlow = async (req, res) => {
  console.log({ shareLaunchFlow: "shareLaunchFlow" });
  const shareLaunchDataPack = req.body;
  const { own_portions } = req.body;
  const userId = req.user.id;
  const validatedResult = validateInputData(
    shareLaunchSchema,
    shareLaunchDataPack
  );
  if (validatedResult.error) {
    return res.status(422).send(validatedResult);
  }
  const memberInfo = await selectMemberInfoById(userId);
  const sharableCheck = checkUserSharable(memberInfo[0], sharableCheckerFn);
  console.log({ sharableCheck: sharableCheck });
  if (sharableCheck.error) {
    return res.status(400).send(sharableCheck);
  }
  const shareLaunchDataArray = formShareLaunchData(userId, shareLaunchDataPack);
  const insertedShareData = await insertShareLaunchDataToDb(
    shareLaunchDataArray
  );
  const ownPortionsDataArray = formOwnPortionsData(
    insertedShareData[0].id,
    own_portions,
    userId
  );
  const insertedOwnPortions = await insertOwnPortionsToMatchedShare(
    ownPortionsDataArray
  );
  console.log({ insertedShareData: insertedShareData });
  const sharedTimes = await updateMemberTypeInfo(userId);
  console.log({ sharedTimes: sharedTimes });
  const expiryDate = insertedShareData[0].expiry_date;
  insertedShareData[0].expiry_date = timestampToDate(expiryDate);
  insertedShareData[0].sharedTimes = sharedTimes[0].shared_times;
  const respondedResult = formLocationInfo(insertedShareData[0]);
  return res.status(200).send({ data: respondedResult });
};

const checkMemberType = ({ member_type }) => {
  if (member_type === "monthly_plan" || member_type === "annual_plan") {
    return { pass: "Sharable." };
  }
  return { error: "Standard membership type can not launch a share" };
};

const checkMemberTypeExpired = ({ expired_datetime }) => {
  const now = new Date();
  const nowEpochTime = now.getTime();
  const expiryDateEpochTime = parseFloat(expired_datetime) * 1000;
  if (nowEpochTime <= expiryDateEpochTime) {
    return { pass: "Sharable." };
  }
  return { error: "Membership type expired." };
};

const checkOverSharableTimes = ({ shared_times, shared_limit_times }) => {
  if (shared_limit_times > shared_times) {
    return { pass: "Sharable." };
  }
  return { error: "Daily share already reach limitation." };
};

// The later checker fn result will overlap the former one,
// thus, higher priority check should place later
const sharableCheckerFn = [
  checkOverSharableTimes,
  checkMemberTypeExpired,
  checkMemberType,
];

const checkUserSharable = (memberInfo, sharableCheckerFn) => {
  return sharableCheckerFn.reduce((result, checkerFn) => {
    const checkerResult = checkerFn(memberInfo);
    if (checkerResult.error) {
      return (result = checkerResult);
    }
    return result;
  }, {});
};

const formShareLaunchData = (userId, shareLaunchDataPack) => {
  const now = new Date();
  const {
    name,
    category,
    food_description,
    image,
    expiry_date,
    county,
    district,
    address,
    meet_up_datetime,
    unit_description,
    total_portions,
    price,
    location,
  } = shareLaunchDataPack;
  const dataToDb = [
    userId,
    name,
    category,
    food_description,
    image,
    expiry_date,
    county,
    district,
    address,
    meet_up_datetime,
    total_portions,
    price,
    now,
    now,
    unit_description,
    location.lat,
    location.lng,
    "active",
  ];
  return dataToDb;
};

const formOwnPortionsData = (shareId, ownPortions, userId) => {
  const now = new Date();
  return [shareId, userId, "active", ownPortions, now, now];
};

const formLocationInfo = (shareFoodsDataObj) => {
  console.log({ formLocationInfo: shareFoodsDataObj });
  shareFoodsDataObj.location = {};
  shareFoodsDataObj.location.lat = shareFoodsDataObj.latitude;
  shareFoodsDataObj.location.lng = shareFoodsDataObj.longitude;
  delete shareFoodsDataObj["latitude"];
  delete shareFoodsDataObj["longitude"];
  return shareFoodsDataObj;
};

const shareSearchFlow = async (req, res) => {
  console.log({ shareLaunchFlow: "shareSearch Flow" });
  const shareSearchDataPack = req.body;
  const validatedResult = validateInputData(
    shareSearchSchema,
    shareSearchDataPack
  );
  if (validatedResult.error) {
    return res.status(422).send(validatedResult);
  }
  const searchResult = await selectSharesBySearchInfo(shareSearchDataPack);
  return res.status(200).send({ data: searchResult });
};

// console.log(validateInputData(shareSearchSchema, inputData));

const shareJoinFlow = async (req, res) => {
  const shareJoinDataPack = req.body;
  const { taken_portions } = req.body;
  const validatedResult = validateInputData(shareJoinSchema, shareJoinDataPack);
  if (validatedResult.error) {
    return res.status(422).send(validatedResult);
  }
  const shareInfoFromDb = await selectShareById(shareJoinDataPack);
  const theShareInfo = shareInfoFromDb[0];
  if (!theShareInfo) {
    return res.status(500).send({ error: "Internal server error." });
  } else if (
    theShareInfo.total_taken_portions + taken_portions >
    theShareInfo.total_portions
  ) {
    return res
      .status(422)
      .send({ error: "Demanded portions is greater than total portions." });
  }
  const launcherId = theShareInfo.user_id;
  const participantId = req.user.id;
  const shareJoinDataToDb = formShareJoinDataToDb(
    shareJoinDataPack,
    participantId
  );
  const insertedNRespondedData = await insertShareJoinToDb(shareJoinDataToDb);
  const respondedData = insertedNRespondedData[0];
  respondedData.share_launcher = launcherId;
  console.log({ insertedNRespondedData: respondedData });
  return res.status(200).send({ data: respondedData });
};

const formShareJoinDataToDb = ({ share_id, taken_portions }, participantId) => {
  const now = new Date();
  return [share_id, participantId, taken_portions, now, now, "active"];
};

const shareDetailFlow = async (req, res) => {
  const { shareId } = req.query;
  const shareDteailInfo = await getShareDetailInfo(shareId);
  const respondedResult = formLocationInfo(shareDteailInfo[0]);
  return res.status(200).send({ data: respondedResult });
};

const personalLaunchFlow = async (req, res) => {
  const userId = req.user.id;
  const personalLaunchInfo = await getPersonalLaunchInfo(userId);
  return res.status(200).send({ data: personalLaunchInfo });
};

const personalJoinFlow = async (req, res) => {
  const userId = req.user.id;
  const personalJoinedInfo = await getPersonalJoinedInfo(userId);
  return res.status(200).send({ data: personalJoinedInfo });
};

const deleteLaunchedShareFlow = async (req, res) => {
  const { shareId } = req.query;
  const userId = req.user.id;
  const inactiveShare = inactivateLaunchShareInfo(shareId);
  const personalLaunchInfo = await getPersonalLaunchInfo(userId);
  return res.status(200).send({ data: personalLaunchInfo });
};

const deleteJoinedShareFlow = async (req, res) => {
  const { matchId } = req.query;
  const userId = req.user.id;
  const inactiveShare = inactivateJoinedShareInfo(matchId);
  const personalJoinedInfo = await getPersonalJoinedInfo(userId);
  return res.status(200).send({ data: personalJoinedInfo });
};

module.exports = {
  shareLaunchFlow,
  shareSearchFlow,
  shareJoinFlow,
  shareDetailFlow,
  personalLaunchFlow,
  personalJoinFlow,
  deleteLaunchedShareFlow,
  deleteJoinedShareFlow,
};

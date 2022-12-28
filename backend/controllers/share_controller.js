const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
const {
  shareLaunchSchema,
  shareSearchSchema,
} = require("../schemas/share_schema");
const {
  selectMemberInfoById,
  insertShareLaunchDataToDb,
  updateMemberTypeInfo,
  selectSharesBySearchInfo,
  insertOwnPortionsToMatchedShare,
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
    return res.status(400).send(validatedResult);
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
  insertedShareData[0].location = {};
  insertedShareData[0].location.lat = insertedShareData[0].latitude;
  insertedShareData[0].location.lng = insertedShareData[0].longitude;
  delete insertedShareData[0]["latitude"];
  delete insertedShareData[0]["longitude"];
  return res.status(200).send({ data: insertedShareData[0] });
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

const shareSearchFlow = async (req, res) => {
  console.log({ shareLaunchFlow: "shareSearch Flow" });
  const shareSearchDataPack = req.body;
  const validatedResult = validateInputData(
    shareSearchSchema,
    shareSearchDataPack
  );
  if (validatedResult.error) {
    return res.status(400).send(validatedResult);
  }
  const searchResult = await selectSharesBySearchInfo(shareSearchDataPack);
  return res.status(200).send({ data: searchResult });
};

// console.log(validateInputData(shareSearchSchema, inputData));

module.exports = {
  shareLaunchFlow,
  shareSearchFlow,
};

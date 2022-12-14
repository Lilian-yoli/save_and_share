const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
const { shareLaunchSchema } = require("../schemas/share_schema");
const {
  selectMemberInfoById,
  insertShareLaunchDataToDb,
  updateMemberTypeInfo,
} = require("../models/share_model");
addFormats(ajv, { mode: "fast", formats: ["date-time"], keywords: true });

const shareLaunchFlow = async (req, res) => {
  console.log({ shareLaunchFlow: "shareLaunchFlow" });
  const shareLaunchDataPack = req.body;
  const userId = req.user.id;
  const validatedResult = validateShareLaunchData(shareLaunchDataPack);
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
  console.log({ insertedShareData: insertedShareData });
  const sharedTimes = await updateMemberTypeInfo(userId);
  console.log({ sharedTimes: sharedTimes });
  insertedShareData[0].sharedTimes = sharedTimes[0].shared_times;
  return res.status(200).send({ data: insertedShareData[0] });
};

const validateShareLaunchData = (shareLaunchDataPack) => {
  const validate = ajv.compile(shareLaunchSchema);
  const valid = validate(shareLaunchDataPack);
  //   DEBUG
  //   console.log(validate.errors);
  if (!valid) {
    return { error: "Format error with share launch input data." };
  }
  return { error: null };
};

const checkMemberType = ({ member_type }) => {
  if (member_type === "monthly_plan" || member_type === "annual_plan") {
    return { pass: "Sharable." };
  }
  return { error: "Standard membership type can not launch a share" };
};
// console.log(checkMemberType({ member_type: "annual_plan" }));

const checkMemberTypeExpired = ({ expired_datetime }) => {
  const now = new Date();
  const nowEpochTime = now.getTime();
  const expiryDateEpochTime = parseFloat(expired_datetime) * 1000;
  if (nowEpochTime <= expiryDateEpochTime) {
    return { pass: "Sharable." };
  }
  return { error: "Membership type expired." };
};
// console.log(
//   checkMemberTypeExpired({
//     member_type: "standard",
//     shared_times: 0,
//     shared_limit_times: 0,
//     expiry_datetime: "1670442633.486000",
//     updated: "2022-12-07T11:50:33.486Z",
//   })
// );

const checkOverSharableTimes = ({ shared_times, shared_limit_times }) => {
  if (shared_limit_times > shared_times) {
    return { pass: "Sharable." };
  }
  return { error: "Daily share already reach limitation." };
};
// console.log(checkOverSharableTimes({ shared_times: 3, shared_limit_times: 2 }));

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
console.log(
  checkUserSharable(
    {
      member_type: "annual_plan",
      shared_times: 0,
      shared_limit_times: 2,
      expiry_datetime: "1870442633.486000",
      updated: "2022-12-07T11:50:33.486Z",
    },
    sharableCheckerFn
  )
);

const validTest = {
  name: "Dozen of Haggan Daz",
  category: "水果",
  food_description: "12 cups of Haggan Daz",
  image: "http://images/image.png",
  expiry_date: "2022-12-06T07:50:16.830Z",
  county: "台南市",
  district: "East district",
  address: "No.1, Cheng Kung road",
  meet_up_datetime: "2022-12-06T07:50:16.830Z",
  unit_description: "a cup, 450ml",
  total_portions: 12,
  own_portions: 3,
  price: 100,
};
// console.log(validateShareLaunchData(validTest));

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
    own_portions,
    price,
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
    own_portions,
    price,
    now,
    now,
    unit_description,
  ];
  return dataToDb;
};
// console.log(formShareLaunchData(2, validTest));
// insertShareLaunchDataToDb(formShareLaunchData(2, validTest));
// updateMemberTypeInfo(2);

module.exports = {
  shareLaunchFlow,
};

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
const { signUpSchema, membershipTypeSchema } = require("./schema");
const {
  insertUserDataToDb,
  selectUserByEmail,
  updateMembershipType,
  insertUserMemberType,
} = require("./model");
const bcrypt = require("bcrypt");
const salt = parseInt(process.env.BCRYPT_SALT);
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRED, TOKEN_SECRET } = process.env;
const axios = require("axios");
addFormats(ajv);

const signUpFlow = async (req, res) => {
  try {
    const signUpBody = req.body;
    const { email, username, password } = signUpBody;
    const validationResult = validateSignUp(signUpBody);
    if (validationResult.errorMsg) {
      return res.status(400).send({ error: validationResult });
    }
    const existedUserData = await selectUserByEmail(email);
    if (existedUserData.length > 0) {
      return res.status(400).send({ error: "Duplicated Email." });
    }
    const signUpDataToDb = processInsertedUserData(
      email,
      username,
      password,
      "native"
    );
    const userData = await insertUserDataToDb(signUpDataToDb);
    console.log({ userDataId: userData[0].id });
    const memberTypeDataToDb = formMemberTypeDataToDb(
      userData[0].id,
      "standard"
    );
    const memberTypeData = await insertUserMemberType(memberTypeDataToDb);
    if (memberTypeData[0].length < 1) {
      return res
        .status(500)
        .send({ error: "Member type failed to insert to DB." });
    }
    const responseUserData = formResUserInfo(userData[0]);
    return res.status(200).send({ data: responseUserData });
  } catch (error) {
    console.log({ signUpFlowError: error });
    throw error;
  }
};

const validateSignUp = (signUpBody) => {
  const validate = ajv.compile(signUpSchema);
  const valid = validate(signUpBody);
  const { password, verified_password } = signUpBody;
  if (!valid || password != verified_password) {
    console.log(validate.errors);
    return { errorMsg: "Format error for sign up info." };
  } else {
    return { errorMsg: null };
  }
};

const validateMembershipType = (membershipTypeObject) => {
  const validate = ajv.compile(membershipTypeSchema);
  const valid = validate(membershipTypeObject);
  if (!valid) {
    return { error: "Membership type format error." };
  }
  return { error: null };
};

const generateAccessToken = (provider, username, email) => {
  return jwt.sign(
    {
      provider: provider,
      username: username,
      email: email,
    },
    TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRED * 1000 }
  );
};

const processInsertedUserData = (email, username, password, provider) => {
  const now = new Date();
  const accessToken = generateAccessToken(provider, username, email);
  const tableData = [
    email,
    username,
    now,
    now,
    provider,
    TOKEN_EXPIRED,
    accessToken,
  ];
  if (provider === "native") {
    tableData.push(bcrypt.hashSync(password, salt));
    return { tableData: tableData };
  } else {
    tableData.push("");
    return { tableData: tableData };
  }
};

const formMemberTypeDataToDb = (id, memberType) => {
  const now = new Date();
  return [id, memberType, 0, 0, null, now, now];
};

const formResUserInfo = (userInfo) => {
  const responseData = (({ access_token, token_expired }) => ({
    access_token,
    token_expired,
  }))(userInfo);
  const responseUserData = (({ id, provider, username, email }) => ({
    id,
    provider,
    username,
    email,
  }))(userInfo);
  responseData.user = responseUserData;
  return responseData;
};

const getFBUser = async (access_token) => {
  try {
    const { data } = await axios({
      url: "https://graph.facebook.com/me",
      method: "get",
      params: {
        fields: ["id", "email", "name"].join(","),
        access_token: access_token,
      },
    });
    return data;
  } catch (error) {
    console.log({ getFBUser: error });
    throw error;
  }
};

const getGoogleUser = async (access_token) => {
  const googleUser = await axios
    .get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });
  return googleUser;
};

const thirdPartySigninFlow = async (signInInfo) => {
  try {
    const getUserDataByProvider = async (signInInfo) => {
      const { provider, access_token } = signInInfo;
      if (provider === "facebook") {
        const userData = await getFBUser(access_token);
        return userData;
      } else if (provider === "google") {
        const userData = await getGoogleUser(access_token);
        return userData;
      }
    };
    const reqUserData = await getUserDataByProvider(signInInfo);

    console.log({ thirdPartySigninFlow: reqUserData });
    // const reqUserData = await getFBUserData(signInInfo.access_token)
    const { email, name } = reqUserData;
    const existedUserData = await selectUserByEmail(email);
    console.log({ existedUserData: existedUserData });
    if (existedUserData.length == 0) {
      const userDataForDb = processInsertedUserData(
        email,
        name,
        null,
        signInInfo.provider
      );
      const userData = await insertUserDataToDb(userDataForDb);
      console.log({ userData: userData });
      return formResUserInfo(userData[0]);
    }
    return formResUserInfo(existedUserData[0]);
  } catch (error) {
    console.log({ thirdPartySigninFlow: error });
    return { error: "Something went wrong with third party authentication." };
  }
};

const runSigninFlowByProvider = async (signInInfo) => {
  const { provider } = signInInfo;
  if (provider === "facebook" || provider === "google") {
    return await thirdPartySigninFlow(signInInfo);
  } else if (provider === "native") {
    return await nativeSigninFlow(signInInfo);
  }
};

const signInFlow = async (req, res) => {
  const signInInfo = req.body;
  const responseData = await runSigninFlowByProvider(signInInfo);

  console.log({ responseData: responseData });
  if (responseData.error) {
    return res.status(400).send(responseData);
  }
  return res.status(200).send(responseData);
};

const nativeSigninFlow = async (signInInfo) => {
  const { email, password } = signInInfo;
  const userInfo = await selectUserByEmail(email);
  console.log({ userInfo: userInfo });
  if (userInfo.length < 1) {
    return { error: "The email has not yet registered." };
  }
  const passwordFromDb = userInfo[0].password;
  const isPasswordMatch = bcrypt.compareSync(password, passwordFromDb);
  if (!isPasswordMatch) {
    return { error: "Invalid information." };
  }
  const resUserData = formResUserInfo(userInfo[0]);
  return updateAccessToken(resUserData);
};

const updateAccessToken = (userInfo) => {
  const { provider, username, email } = userInfo.user;
  const accessToken = generateAccessToken(provider, username, email);
  userInfo.access_token = accessToken;
  return userInfo;
};

const test = (req, res) => {
  console.log("connected to react!");
  res.send({ message: "connected to react!" });
};

const updateMembershipTypeFlow = async (req, res) => {
  try {
    const dataValidation = validateMembershipType(req.body);
    if (dataValidation.error) {
      return res.status(400).send(dataValidation);
    }
    const membershipType = req.body.membership_type;
    const userId = req.user.id;
    const updatedMembershipType = await updateMembershipType(
      userId,
      membershipType
    );
    console.log({ updatedMembershipType: updatedMembershipType });
    return res.status(200).send(updatedMembershipType[0]);
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .send("Something went wrong from updating membership_type flow.");
  }
};

module.exports = {
  signUpFlow,
  signInFlow,
  updateMembershipTypeFlow,
};

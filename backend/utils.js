const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env;
const { selectUserByEmail } = require("./user/model");
addFormats(ajv, {
  mode: "fast",
  formats: ["date-time", "date"],
  keywords: true,
});
const log = require("npmlog");

const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

const authentication = () => {
  return async function (req, res, next) {
    const rawAccessToken = req.get("Authorization");
    if (!rawAccessToken) {
      return res.status(401).send({ error: "Unauthorized." });
    }
    const accessToken = rawAccessToken.replace("Bearer ", "");
    try {
      const user = jwt.verify(accessToken, TOKEN_SECRET);
      const userInfo = await selectUserByEmail(user.email);
      req.user = user;
      req.user.id = userInfo[0].id;
      console.log({ requser: req.user });
      if (userInfo.length < 1) {
        return res.status(403).send({ error: "Forbidden." });
      } else {
        next();
      }
    } catch (error) {
      console.log({ authentication: error });
      return res.status(403).send({ error: "Forbidden." });
    }
  };
};

const validateInputData = (schema, inputData) => {
  const validate = ajv.compile(schema);
  const valid = validate(inputData);
  if (!valid) {
    //   DEBUG
    log.error(
      "UTILS-VALIDATION",
      "Validation failed message: %j",
      validate.errors
    );
    return { error: "Format error with input data." };
  }
  return { error: null };
};

const timestampToDate = (timestamp) => {
  try {
    const dashFormatDate = timestamp
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .join("-");
    return dashFormatDate;
  } catch (error) {
    throw new Error("Something went wrong in fn timestampToDate");
  }
};

module.exports = {
  wrapAsync,
  authentication,
  validateInputData,
  timestampToDate,
};

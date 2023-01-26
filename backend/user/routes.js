const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const {
  signUpFlow,
  signInFlow,
  updateMemberTypeFlow,
  getMyInfoFlow,
} = require("./service");

router.route("/user/signup").post(wrapAsync(signUpFlow));

router.route("/user/signin").post(wrapAsync(signInFlow));

router
  .route("/user/update-membership-type")
  .post(authentication(), wrapAsync(updateMemberTypeFlow));

router
  .route("/user/get-my-info")
  .get(authentication(), wrapAsync(getMyInfoFlow));

module.exports = router;

const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const {
  signUpFlow,
  signInFlow,
  updateMembershipTypeFlow,
} = require("./service");

router.route("/user/signup").post(wrapAsync(signUpFlow));

router.route("/user/signin").post(wrapAsync(signInFlow));

router
  .route("/user/update-membership-type")
  .post(authentication(), wrapAsync(updateMembershipTypeFlow));

module.exports = router;

const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const {
  signUpFlow,
  signInFlow,
  updateMemberTypeFlow,
  testCors,
} = require("./service");

// TESTING: should remove after testing
router.route("/user/test-cors").post(testCors);

router.route("/user/signup").post(wrapAsync(signUpFlow));

router.route("/user/signin").post(wrapAsync(signInFlow));

router
  .route("/user/update-membership-type")
  .post(authentication(), wrapAsync(updateMemberTypeFlow));

module.exports = router;

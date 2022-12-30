const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const {
  shareLaunchFlow,
  shareSearchFlow,
  shareJoinFlow,
  shareDetailFlow,
  personalLaunchFlow,
} = require("../controllers/share_controller");

router
  .route("/share/share-launch")
  .post(authentication(), wrapAsync(shareLaunchFlow));

router.route("/share/share-search").post(wrapAsync(shareSearchFlow));

router
  .route("/share/share-join")
  .post(authentication(), wrapAsync(shareJoinFlow));

router.route("/share/share-detail").get(wrapAsync(shareDetailFlow));

router
  .route("/share/personal-launch")
  .get(authentication(), wrapAsync(personalLaunchFlow));

module.exports = router;

const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const {
  shareLaunchFlow,
  shareSearchFlow,
} = require("../controllers/share_controller");

router
  .route("/share/share-launch")
  .post(authentication(), wrapAsync(shareLaunchFlow));

router.route("/share/share-search").post(wrapAsync(shareSearchFlow));

module.exports = router;

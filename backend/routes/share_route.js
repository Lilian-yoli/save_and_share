const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const { shareLaunchFlow } = require("../controllers/share_controller");

router
  .route("/share/share-launch")
  .post(authentication(), wrapAsync(shareLaunchFlow));

module.exports = router;

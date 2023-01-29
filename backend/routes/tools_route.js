const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const { tappayDirectPayFlow } = require("../controllers/tools_controller");

router
  .route("/tools/tappay-direct-pay")
  .post(authentication(), wrapAsync(tappayDirectPayFlow));

module.exports = router;

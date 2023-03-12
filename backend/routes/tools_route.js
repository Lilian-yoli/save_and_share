const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const { tappayPrimePayFlow } = require("../controllers/tools_controller");

router
  .route("/tools/tappay-prime-pay")
  .post(authentication(), wrapAsync(tappayPrimePayFlow));

module.exports = router;

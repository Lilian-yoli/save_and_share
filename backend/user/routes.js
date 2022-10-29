const router = require("express").Router();
const { wrapAsync } = require("../utils")
const { signUpFlow } = require("./service")



router.route('/user/signup')
.post(wrapAsync(signUpFlow));

module.exports = router;
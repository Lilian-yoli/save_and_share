const router = require("express").Router();
const { wrapAsync } = require("../utils")
const { signUpFlow, signInFlow } = require("./service")


router.route('/user/signup')
.post(wrapAsync(signUpFlow));

router.route('/user/signin')
.post(wrapAsync(signInFlow));


module.exports = router;
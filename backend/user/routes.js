const router = require("express").Router();
const { wrapAsync } = require("../utils")
const { signUpFlow, signUpResponse } = require("./service")
const { insertSignUpToDb } = require("./model")


router.route('/user/signup')
.post(wrapAsync(signUpFlow), wrapAsync(insertSignUpToDb), wrapAsync(signUpResponse));

module.exports = router;
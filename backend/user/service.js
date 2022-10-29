const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({allErrors:true}) // options can be passed, e.g. {allErrors: true}
const  { signUpSchema } = require("./schema")
const { insertSignUpToDb } = require("./model")
const bcrypt = require("bcrypt")
const salt = parseInt(process.env.BCRYPT_SALT)
const jwt = require("jsonwebtoken")
const { TOKEN_EXPIRED, TOKEN_SECRET } = process.env
addFormats(ajv)


const signUpFlow = async (req, res) => {
    const signUpBody = req.body
    const validationResult = validateSignUp(signUpBody)    
    if (validationResult.errorMsg) {
        return res.status(400).send({error: validationResult})
    }
    const signUpDataToDb = processSignUpData(signUpBody)
    const insertedSignUpData = await insertSignUpToDb(signUpDataToDb)
    if (insertedSignUpData.errorMsg) {
        return res.status(400).send({error: insertedSignUpData})
    }
    return res.status(200).send({data: insertedSignUpData})
}


const validateSignUp = (signUpBody) => {
    const validate = ajv.compile(signUpSchema)
    const valid = validate(signUpBody)
    const { password, verified_password } = signUpBody
    if (!valid || password != verified_password) {
        return {errorMsg: "Format error for sign up info."}
    } else {
        return {errorMsg: null}
    }      
}


const processSignUpData = (signUpBody) => {
    const { email, username, password } = signUpBody
    const now = new Date()
    const accessToken = jwt.sign({
        provider: "native",
        username: username,
        email: email,  
    }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRED * 1000})
    const dataToDb = {email: email,
                      tableData: [email, bcrypt.hashSync(password, salt), 
                                  username, now, now, "standard", "native", 
                                  TOKEN_EXPIRED, accessToken]}
    return dataToDb
}


module.exports = {
    signUpFlow
}

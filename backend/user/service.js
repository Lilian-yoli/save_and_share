const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({allErrors:true}) // options can be passed, e.g. {allErrors: true}
const  { signUpSchema } = require("./schema")
const { insertSignUpToDb, selectUserByEmail } = require("./model")
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
    const existedUserData = await selectUserByEmail(signUpBody.email)
    if (existedUserData.length > 0){
        return res.status(400).send({error: {errorMsg: "Duplicated Email."}})
    }
    const signUpDataToDb = processSignUpData(signUpBody)
    const userData = await insertSignUpToDb(signUpDataToDb)
    const responseUserData = formResUserInfo(userData[0])
    return res.status(200).send({data: responseUserData})
}


const validateSignUp = (signUpBody) => {
    const validate = ajv.compile(signUpSchema)
    const valid = validate(signUpBody)
    const { password, verified_password } = signUpBody
    if (!valid || password != verified_password) {
        console.log(validate.errors)
        return {errorMsg: "Format error for sign up info."}
    } else {
        return {errorMsg: null}
    }      
}


const generateAccessToken = (provider, username, email) => {
    return jwt.sign({
            provider: provider,
            username: username,
            email: email,  
        }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRED * 1000})
}


const processSignUpData = (signUpBody) => {
    const { email, username, password } = signUpBody
    const now = new Date()
    const accessToken = generateAccessToken("native", username, email)
    const dataToDb = {email: email,
                      tableData: [email, bcrypt.hashSync(password, salt), 
                                  username, now, now, "standard", "native", 
                                  TOKEN_EXPIRED, accessToken]}
    return dataToDb
}


const formResUserInfo = (userInfo) => {
    const responseData = (({access_token, token_expired}) => 
                            ({access_token, token_expired}))(userInfo)
    const responseUserData = (({id, provider, username, email}) =>
                                ({id, provider, username, email}))(userInfo)
    responseData.user =  responseUserData                                                 
    return responseData
}


const signInFlow = async (req, res) => {
    const wrongInfoMsg = {errorMsg: "Invalid information."}
    const userInfo = await selectUserByEmail(req.body.email)
    if (userInfo.length < 1) {
        return res.status(400).send({error: wrongInfoMsg})
    }
    const passwordFromDb = userInfo[0].password
    const isPasswordMatch = 
        bcrypt.compareSync(req.body.password, passwordFromDb)
    if (!isPasswordMatch) {
        return res.status(400).send({error: wrongInfoMsg})
    }
    const resUserData = formResUserInfo(userInfo[0])
    const updatedResUserData = updateAccessToken(resUserData)
    return res.status(200).send({data: updatedResUserData})
}


const updateAccessToken = (userInfo) => {
    const { provider, username, email } = userInfo.user
    const accessToken = generateAccessToken(provider, username, email)
    userInfo.access_token = accessToken
    return userInfo
}


module.exports = {
    signUpFlow,
    signInFlow
}

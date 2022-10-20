const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({allErrors:true}) // options can be passed, e.g. {allErrors: true}
const  { signUpSchema } = require("./schema")
addFormats(ajv)


const signUpFlow = async (req, res, next) => {
    const signUpBody = req.body
    const validationResult = validateSignUp(signUpBody)
    if (!validationResult.errorMsg) {
        next();
    } else {
        return res.status(400).send({error: validationResult})
    }
}


// TODO: categorize error info and send back to FE
const validateSignUp = (signUpBody) => {
    const validate = ajv.compile(signUpSchema)
    const valid = validate(signUpBody)
    const errorInfo = validate.errors
    if (!valid) {
        const errorMsg = errorInfo.map((error) => {
            return error.message
        })
        return {errorMsg: errorMsg}
    } else {
        return {errorMsg: null}
    }      
}


const signUpResponse = async (req, res) => {
    const result = res.body
    res.status(200).send(result)
}


module.exports = {
    signUpFlow,
    signUpResponse
}

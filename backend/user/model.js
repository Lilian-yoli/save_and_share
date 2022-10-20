const { pgsqlPool } = require("./../pgsql_connection")
const bcrypt = require("bcrypt")
const salt = parseInt(process.env.BCRYPT_SALT)
const jwt = require("jsonwebtoken")
const { TOKEN_EXPIRED, TOKEN_SECRET } = process.env

// TODO: 1. tidy up model for db CRUD only
//       2. replace promise to async await
const insertSignUpToDb = async (req, res, next) => {
        try {
            console.log("insertSignUpToDb")
            const { email, username, password} = req.body
            const now = new Date()
            const accessToken = jwt.sign({
                provider: "native",
                username: username,
                email: email,  
            }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRED * 1000})
            console.log({accessToken: accessToken})
            const insertQuery = "INSERT INTO members (email, password, username, created, updated, membership_type, provider, token_expired, access_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"
            await pgsqlPool
                .query(insertQuery, [email, bcrypt.hashSync(password, salt), username, now, now, "standard", "native", TOKEN_EXPIRED, accessToken])
                .then((result) => {
                    const responseUserData = {data: {}}
                    const insertedData = result.rows[0]
                    const responseUserToken = (({access_token, token_expired}) => 
                                               ({access_token, token_expired}))(insertedData)
                    const responseUserInfo = (({id, provider, username, email}) =>
                                              ({id, provider, username, email}))(insertedData)
                    responseUserData.data =  responseUserToken
                    responseUserData.data.user = responseUserInfo                                                 
                    console.log({insertedData: insertedData,
                                 responseUserToken: responseUserToken,
                                 responseUserData: responseUserData})
                    res.body = responseUserData
                    console.log({dbResult: result})})
                .catch(e => console.error(e.stack))
            return next()
        } catch (error) {
            console.log({insertSignUpToDb: error})
            throw error
        }
} 
    

module.exports = {
    insertSignUpToDb
}


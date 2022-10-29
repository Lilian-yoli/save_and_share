const { pgsqlPool } = require("./../pgsql_connection")

// TODO: 2. replace promise to async await
const insertSignUpToDb = async (signUpDataToDb) => {
        try {
            console.log("insertSignUpToDb")
            const { email, tableData } = signUpDataToDb
            const selectEmailQuery = "SELECT * from members where email = $1"
            const selectedResult = 
            await pgsqlPool
                .query(selectEmailQuery, [email])
                .then((result) => {
                    return result.rows.length})
                .catch(e => console.error(e.stack))
            if (selectedResult > 0){
                return {errorMsg: "Duplicated email."}
            }
            const insertQuery = "INSERT INTO members (email, password, username, created, updated, membership_type, provider, token_expired, access_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"
            const insertedResult =
            await pgsqlPool
                .query(insertQuery, tableData)
                .then((result) => {
                    const insertedData = result.rows[0]
                    const responseData = (({access_token, token_expired}) => 
                                               ({access_token, token_expired}))(insertedData)
                    const responseUserInfo = (({id, provider, username, email}) =>
                                              ({id, provider, username, email}))(insertedData)
                    responseData.user =  responseUserInfo                                                 
                    return responseData})
                .catch(e => console.error(e.stack))
            return insertedResult
        } catch (error) {
            console.log({insertSignUpToDb: error})
            throw error
        }
} 
    
 
module.exports = {
    insertSignUpToDb
}


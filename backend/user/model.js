const { pgsqlPool } = require("./../pgsql_connection")


const selectUserByEmail = async (email) => {
    try{
        const selectEmailQuery = "SELECT * from members where email = $1"
        const selectedResult = 
            await pgsqlPool.query(selectEmailQuery, [email])
                .then((result) => {             
                    return result.rows})
                .catch(e => console.error(e.stack))
        return selectedResult
    } catch (error) {
        console.log({checkUserInfo: error})
        throw error
    }
}

// TODO: 2. replace promise to async await
const insertUserDataToDb = async (signUpDataToDb) => {
        try {
            console.log("insertUserDataToDb")
            const { tableData } = signUpDataToDb
            const insertQuery = "INSERT INTO members (email, password, username, created, updated, membership_type, provider, token_expired, access_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"
            const insertedResult =
            await pgsqlPool
                .query(insertQuery, tableData)
                .then((result) => {                                                
                    return result.rows})
                .catch(e => console.error(e.stack))
            return insertedResult
        } catch (error) {
            console.log({insertUserDataToDb : error})
            throw error
        }
}


const updateMembershipType = async (id, membershipType) => {
    try{
        console.log("updateMembershipType")
        const updateQuery = "UPDATE members SET membership_type = $1 where id = $2 RETURNING membership_type"
        const updatedResult = 
            await pgsqlPool.query(updateQuery, [membershipType, id])
                .then((result) => {             
                    return result.rows})
                .catch(e => console.error(e.stack))
                return updatedResult
    } catch (error) {
        console.log(error)
        throw error
    }
}
    
 
module.exports = {
    insertUserDataToDb,
    selectUserByEmail,
    updateMembershipType
}


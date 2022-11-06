const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env
const { selectUserByEmail } = require("./user/model")

const wrapAsync = (fn) => {
    return function (req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next).catch(next);
    };
  };


const authentication = () => {
  return function (req, res, next){
    const rawAccessToken = req.get("Authorization")
    if (!rawAccessToken) {
      return res.status(401).send({error: "Unauthorized."})
    }
    const accessToken = rawAccessToken.replace("Bearer ", "")
    try {
      const userEmail = jwt.verify(accessToken, TOKEN_SECRET).email
      const userInfo = selectUserByEmail(userEmail)
      if (userInfo.length < 1) {
        return res.status(403).send({error: "Forbidden."})
      } else {
        next()
      }
    } catch (error) {
      return res.status(403).send({error: "Forbidden."})
    }
  } 
}

module.exports = {
    wrapAsync,
    authentication
}
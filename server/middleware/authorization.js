const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {

        const jwtToken = req.header("token");

        if (!jwtToken){
            return res.status(403).json("Not Authorized");
        }

        //checking if the token is valid

        //if verified, will return paylod we can use in routes
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
}
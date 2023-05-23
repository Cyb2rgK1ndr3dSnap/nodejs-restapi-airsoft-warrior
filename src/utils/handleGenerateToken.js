const jwt = require("jsonwebtoken");
require("dotenv/config");

const tokenSign = async (user) => {
    return jwt.sign(user, process.env.JWT_SECRET,
        { 
            expiresIn: "1h"
        });
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = {
    tokenSign,
    verifyToken
}
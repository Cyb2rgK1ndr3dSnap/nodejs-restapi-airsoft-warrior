const {
    handleErrorResponse,
    handleHttpError
} = require("../utils/handleError");

const {
    verifyToken
} = require("../utils/handleGenerateToken")

require("dotenv/config");

const chechAuth = async (req, res, next) =>{
    try {
        if(!req.cookies[process.env.COOKIE_NAME]) return handleErrorResponse(res,"Debe iniciar sesión",401)//res.redirect(`${process.env.UI_ROOT_URI}`);//
        const decoded = await verifyToken(req.cookies[process.env.COOKIE_NAME].token);
        if(decoded.id){
            req.userIdCookie = decoded.id;
            next();
        }else {
            handleErrorResponse(res,"Debe iniciar sesión",400)
        }
    } catch (error) {
        handleHttpError(res,error)
    }
}

module.exports = {
    chechAuth
}
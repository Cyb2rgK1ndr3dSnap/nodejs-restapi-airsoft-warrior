const {
    handleErrorResponse,
    handleHttpError
} = require("../utils/handleError");

const {
    verifyToken
} = require("../utils/handleGenerateToken")

const chechAuth = async (req, res, next) =>{
    try {
        if(!req.cookies[process.env.COOKIE_NAME]) return handleErrorResponse(res,"Debe iniciar sesión",400)
        const decoded = await verifyToken(req.cookies[process.env.COOKIE_NAME].value);
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
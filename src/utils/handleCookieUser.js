require("dotenv/config");

const cookieCreate = async (req,res,cookieName,value,maxAge) =>{
    await res.cookie(cookieName, 
    {
        token:value
    }, 
    {
        domain:`${process.env.COOKIE_SET_DOMAIN}`,
        maxAge: maxAge,
        httpOnly: true,
        secure: true,
        sameSite:false
    });
}

module.exports = {
    cookieCreate
}
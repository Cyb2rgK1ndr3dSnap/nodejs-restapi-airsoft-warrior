require("dotenv/config");

const cookieUser = async (req,res,cookieName,value,maxAge) =>{
    try {
        await res.cookie(cookieName, 
            {
                token:value
            }, 
            {
                domain:`${process.env.COOKIE_SET_DOMAIN}`,
                maxAge: maxAge,
                httpOnly: true,
                //secure: true,
                sameSite:false
            });
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    cookieUser
}
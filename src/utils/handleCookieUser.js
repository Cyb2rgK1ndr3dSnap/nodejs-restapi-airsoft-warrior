require("dotenv/config");

const cookieCreate = async (req,res,cookieName,value,maxAge) =>{
    await res.cookie(cookieName, 
    {
        "username":value.name,
        "url_img_user":value.image_url,
        "age":value.age,
        "phonenumber":value.phonenumber,
        "token":value.token
    }, 
    {
        domain:`${process.env.COOKIE_SET_DOMAIN}`,
        maxAge: maxAge,
        httpOnly: true,
        secure: true,
        sameSite:"Strict"
    });
}

module.exports = {
    cookieCreate
}
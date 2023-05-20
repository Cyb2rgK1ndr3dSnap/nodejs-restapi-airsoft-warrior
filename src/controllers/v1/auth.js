const querystring = require("querystring");
const axios = require("axios")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv/config");

const getGoogleAuthURL = (req, res) =>{
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env.SERVER_ROOT_URI}/api/auth/google`,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
  
    //return `${rootUrl}?${querystring.stringify(options)}`;
    res.status(200).json({"url":`${rootUrl}?${querystring.stringify(options)}`})
}

const getTokens = ({ code, clientId, clientSecret, redirectUri }) => {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token"
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    }
    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => res.data)
      .catch(error => {
        console.error(`Failed to fetch auth tokens`)
        throw new Error(error.message)
      })
}

const setCookie = async (req, res) => {
    const code = req.query.code;
    console.log(code)
    const { id_token, access_token } = await getTokens({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.SERVER_ROOT_URI}/api/auth/google`,
    });
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    const token = jwt.sign(googleUser, process.env.JWT_SECRET);
    res.cookie(process.env.COOKIE_NAME, 
    {
      "username":googleUser.name,
      "url_img_user":googleUser.picture,
      "token":token
    }, {
      domain:`${process.env.COOKIE_SET_DOMAIN}`,
      maxAge: 900000,
      httpOnly: false,
      secure: true,
      sameSite:"None"
    });
    //console.log(process.env.UI_ROOT_URI)
    //res.redirect(`${process.env.UI_ROOT_URI}/api/auth/me`);
    res.redirect(`${process.env.UI_ROOT_URI}`);
    //res.json(googleUser)
}

const getCookie = (req, res) => {
    //console.log("get me");
    console.log(req.cookies[process.env.COOKIE_NAME])
    try {
      const decoded = jwt.verify(req.cookies[process.env.COOKIE_NAME].token, process.env.JWT_SECRET);
      //return res.status(200).send({"username":req.cookies[process.env.COOKIE_NAME].username,"url_img_user":googleUser.picture,"token":decoded});
      return res.status(200).send({"username":req.cookies[process.env.COOKIE_NAME].username,"url_img_user":req.cookies[process.env.COOKIE_NAME].picture,"token":decoded});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
}

const deleteCookie = (req,res) =>{
    try{
        res.clearCookie(process.env.COOKIE_NAME, {path:`/`});
        res.redirect(`${process.env.UI_ROOT_URI}`);
    }catch (err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getGoogleAuthURL,
    setCookie,
    getCookie,
    deleteCookie
}
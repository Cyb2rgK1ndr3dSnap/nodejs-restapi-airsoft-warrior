const { Router } = require ("express");
const router = Router()
//const {authGoogle} = require("../../middleware/authGoogle")
//const {googleSignup} = require("../../controllers/v1/testingAuth")
//const redirectURI = "google";
const {
  getGoogleAuthURL,
  getTokens,
  setCookie,
  getCookie
} = require("../../controllers/v1/auth")


router
    .get("/google/url", getGoogleAuthURL)

    .get(`/google`, setCookie)

    .get("/me", getCookie)

    .get(`/logout`, (req,res)=>{

    })

    .post("/register",)

    //.post("/login",authGoogle,googleSignup)

module.exports = router
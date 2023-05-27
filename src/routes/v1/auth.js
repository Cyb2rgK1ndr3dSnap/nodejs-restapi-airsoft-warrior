const { Router } = require ("express");
const multerUpload = require("../../utils/handleStorage")
const router = Router()
//const {authGoogle} = require("../../middleware/authGoogle")
//const {googleSignup} = require("../../controllers/v1/testingAuth")
//const redirectURI = "google";
const {
  getGoogleAuthURL,
  loginUserGoogle,
  getCookie,
  deleteCookie,
  createUser,
  updateUser,
  loginUser
} = require("../../controllers/v1/auth")

const {
  validateRegister,
  validateUpdate,
  validateLogin
} = require("../../validators/auth")

router
    .get("/google/url", getGoogleAuthURL)

    .get(`/google`,loginUserGoogle)

    .get("/me", getCookie)

    .get(`/logout`,deleteCookie)

    .post("/register",multerUpload.single('image'),validateRegister,createUser)

    .post(`/login`,validateLogin,loginUser)
    
    .put(`/`,multerUpload.single('image'),validateUpdate,updateUser)

    //.post("/login",authGoogle,googleSignup)

module.exports = router
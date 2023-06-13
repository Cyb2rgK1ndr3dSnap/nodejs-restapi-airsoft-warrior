const { Router } = require ("express");
const router = Router()
const multerUpload = require("../../utils/handleStorage")

const {
  getGoogleAuthURL,
  loginUserGoogle,
  getCookie,
  deleteCookie,
  createUser,
  updateUser,
  loginUser,
  getProfile
} = require("../../controllers/v1/auth")

const {
  validateRegister,
  validateUpdate,
  validateLogin
} = require("../../validators/auth")

const {
  chechAuth
} = require("../../middleware/auth")

router
    .get("/google/url", getGoogleAuthURL)

    .get(`/google`,loginUserGoogle)

    .get("/me", getCookie)

    .post("/register",multerUpload.single('image'),validateRegister,createUser)

    .post(`/login`,validateLogin,loginUser)
    
    .put(`/`,multerUpload.single('image'), chechAuth, validateUpdate,updateUser)

    .get(`/logout`,deleteCookie)

    .get(`/profile`, chechAuth, getProfile)

module.exports = router
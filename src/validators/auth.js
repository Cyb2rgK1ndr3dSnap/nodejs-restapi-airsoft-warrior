const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateRegister = [
    check("email").exists().notEmpty(),
    check("age").exists().notEmpty(),
    check("password").exists().notEmpty(),
    check("cpassword").exists().notEmpty(),
    check("image").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateLogin = [
    check("email").exists().notEmpty(),
    check("password").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]

module.exports = {
    validateRegister,
    validateLogin
}
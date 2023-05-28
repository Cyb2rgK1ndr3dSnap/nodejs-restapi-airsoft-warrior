const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateRegister = [
    check("email").exists().notEmpty().isEmail(),
    check("age").exists().notEmpty(),
    check("password").exists().notEmpty().isLength({min:8, max:16}),
    check("cpassword").exists().notEmpty().isLength({min:8, max:16}),
    check("image").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateUpdate = [
    check("image").exists().notEmpty().optional(),
    check("name").exists().notEmpty().optional(),
    check("lastname").exists().notEmpty().optional(),
    check("age").exists().notEmpty().optional(),
    check("phonumber").exists().notEmpty().optional(),
    check("password").exists().notEmpty().optional(),
    check("newpassword").exists().notEmpty().optional().isLength({min:8, max:16}),
    check("cnewpassword").exists().notEmpty().optional().isLength({min:8, max:16}),
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
    validateUpdate,
    validateLogin
}
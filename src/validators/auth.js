const { check,body } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateRegister = [
    check("image").custom((value, {req}) => {
        var extension = (req.file.mimetype);
        console.log(extension)
        switch (extension) {
            case 'jpg':
                return 'jpg';
            case 'jpeg':
                return 'jpeg';
            case  'png':
                return 'png';
            case  'image/webp':
                return 'image/webp';
            default:
                return false;
        }
    }).optional(),
    body("email").exists().notEmpty().isEmail(),
    body("name").exists().notEmpty(),
    body("age").exists().notEmpty(),
    body("password").exists().notEmpty().isLength({min:8, max:16}),
    body("cpassword").exists().notEmpty().isLength({min:8, max:16}),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateUpdate = [
    check("image").custom((value, {req}) => {
        var extension = (req.file.mimetype);
        console.log(extension)
        switch (extension) {
            case 'jpg':
                return 'jpg';
            case 'jpeg':
                return 'jpeg';
            case  'png':
                return 'png';
            case  'image/webp':
                return 'image/webp';
            default:
                return false;
        }
    }).optional(),
    body("name").exists().notEmpty().optional(),
    body("lastname").exists().notEmpty().optional(),
    body("age").exists().notEmpty().optional(),
    body("phonumber").exists().notEmpty().optional(),
    body("password").exists().notEmpty().optional(),
    body("newpassword").exists().notEmpty().optional().isLength({min:8, max:16}),
    body("cnewpassword").exists().notEmpty().optional().isLength({min:8, max:16}),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateLogin = [
    body("email").exists().notEmpty(),
    body("password").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    }
]

module.exports = {
    validateRegister,
    validateUpdate,
    validateLogin
}
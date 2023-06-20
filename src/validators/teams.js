const { check,body } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validatePagination = (req, res, next) => {
    if(!req.query.p || req.query.p <=0){
        req.query.p=1
    }
    next()
}

const validateId = [
    check("id").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateCreate = [
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
    body("name").exists().notEmpty(),
    body("description").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
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
    body("description").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {
    validatePagination,
    validateId,
    validateCreate,
    validateUpdate
}
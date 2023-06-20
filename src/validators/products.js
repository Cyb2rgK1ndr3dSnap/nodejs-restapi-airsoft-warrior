const { body,check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validatePagination = (req, res, next) => {
    if(!req.query.p || req.query.p <=0){
        req.query.p=1
    }
    if(req.query.name ==="1"){req.query.name = "asc"}
    if(req.query.name ==="0"){req.query.name = "desc"}

    if(req.query.price ==="1"){req.query.price = "asc"}
    if(req.query.price ==="0"){req.query.price = "desc"}
    next()
}

const validateId = [
    check("id").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

const validateCreate = [
    check("image").custom((value, {req}) => {
        var extension = (req.file.mimetype).toLowerCase();
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
    }),
    //.withMessage('Please only submit pdf documents.'),
    body("id_category").exists().notEmpty(),
    body("name").exists().notEmpty(),
    body("description").exists().notEmpty(),
    body("price").exists().notEmpty(),
    body("stock").exists().notEmpty(),
    body("active").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

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
    body("id_category").exists().notEmpty().optional(),
    body("name").exists().notEmpty().optional(),
    body("description").exists().notEmpty().optional(),
    body("price").exists().notEmpty().optional(),
    body("stock").exists().notEmpty().optional(),
    body("active").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

module.exports = {
    validatePagination,
    validateId,
    validateCreate,
    validateUpdate
}
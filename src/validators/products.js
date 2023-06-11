const { check } = require("express-validator");
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
    check("id").exists().notEmpty().isUUID(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateCreate = [
    check("image").exists().notEmpty(),
    check("id_category").exists().notEmpty(),
    check("name").exists().notEmpty(),
    check("description").exists().notEmpty(),
    check("price").exists().notEmpty(),
    check("stock").exists().notEmpty(),
    check("active").exists().notEmpty()
]

const validateUpdate = [
    check("id").exists().notEmpty(),
    check("image").exists().notEmpty().optional(),
    check("id_category").exists().notEmpty().optional(),
    check("name").exists().notEmpty().optional(),
    check("description").exists().notEmpty().optional(),
    check("price").exists().notEmpty().optional(),
    check("stock").exists().notEmpty().optional(),
    check("active").exists().notEmpty().optional(),
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
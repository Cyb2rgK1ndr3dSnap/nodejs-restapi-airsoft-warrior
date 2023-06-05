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

const validateCreate = [
    
]

const validateId = [
    check("id").exists().notEmpty().isUUID(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {
    validatePagination,
    validateId
}
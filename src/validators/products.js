const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validatePagination = (req, res, next) => {
    if(!req.query.pagination || req.query.pagination <=0){
        req.query.pagination=1
    }
    if(req.query.order ==="1"){req.query.order = "asc"}
    if(req.query.order ==="0"){req.query.order = "desc"}

    if(req.query.prices ==="1"){req.query.prices = "asc"}
    if(req.query.prices ==="0"){req.query.prices = "desc"}
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
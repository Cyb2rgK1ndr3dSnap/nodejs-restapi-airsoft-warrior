const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validatePagination = (req, res, next) => {
    if(!req.query.pagination || req.query.pagination <=0){
        req.query.pagination=1
    }
    req.query.order = req.query.order ==="1" ? "asc" : "desc",
    req.query.prices = req.query.order ==="1" ? "asc" : "desc",
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
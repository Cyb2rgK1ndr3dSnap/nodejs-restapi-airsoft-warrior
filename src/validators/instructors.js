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
];

const validateCreate = [
    body("video_url").exists().notEmpty().optional(),
    body("description").exists().notEmpty(),
    body("specialist").exists().notEmpty().isArray(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateUpdate = [
    body("video_url").exists().notEmpty().optional(),
    body("description").exists().notEmpty().optional(),
    body("specialist").exists().notEmpty().optional(),
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
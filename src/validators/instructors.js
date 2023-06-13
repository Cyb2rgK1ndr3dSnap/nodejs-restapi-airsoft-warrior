const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validatePagination = (req, res, next) => {
    if(!req.query.p || req.query.p <=0){
        req.query.p=1
    }
    next()
}

const validateId = [
    check("id").exists().notEmpty().isUUID(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

const validateCreate = [
    check("video_url").exists().notEmpty().optional(),
    check("description").exists().notEmpty(),
    check("specialist").exists().notEmpty().isArray(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateUpdate = [
    check("id").exists().notEmpty(),
    check("video_url").exists().notEmpty().optional(),
    check("description").exists().notEmpty().optional(),
    check("specialist").exists().notEmpty().optional(),
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
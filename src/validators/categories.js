const { check,body } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateId = [
    check("id").exists().notEmpty().isInt(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateCreate = [
    body("name").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateUpdate = [
    body("name").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {
    validateCreate,
    validateUpdate,
    validateId
}
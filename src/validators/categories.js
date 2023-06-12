const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateCreate = [
    check("name").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateUpdate = [
    check("name").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateId = [
    check("id").exists().notEmpty().isInt(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {
    validateCreate,
    validateUpdate,
    validateId
}
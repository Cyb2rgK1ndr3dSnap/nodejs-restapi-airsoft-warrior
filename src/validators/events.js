const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateCreate = [
    check("id_place").exists().notEmpty().isInt(),
    check("description").exists().notEmpty(),
    check("price").exists().notEmpty().isDecimal(),
    check("fecha_de_evento").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateUpdate = [
    check("id_place").exists().notEmpty().isInt().optional(),
    check("description").exists().notEmpty().optional(),
    check("price").exists().notEmpty().isDecimal().optional(),
    check("fecha_de_evento").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateId = [
    check("id").exists().notEmpty().isUUID(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {
    validateId,
    validateCreate,
    validateUpdate
}
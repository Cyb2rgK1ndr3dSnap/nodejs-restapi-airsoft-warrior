const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateId = [
    check("id").exists().notEmpty().isUUID(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

const validateCreate = [
    check("video_url").exists().notEmpty().optional(),
    check("description").exists().notEmpty(),
    check("specialist").exists().notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

const validateUpdate = [
    check("video_url").exists().notEmpty().optional(),
    check("description").exists().notEmpty().optional(),
    check("specialist").exists().notEmpty().optional(),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {
    validateId,
    validateCreate,
    validateUpdate
}
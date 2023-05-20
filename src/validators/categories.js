const { check } = require("express-validator");
const { validateResult } = require("../utils/handleValidator");

const validateName = [
    check("name").exists().notEmpty().custom((value, {req}) => (value === req.body.name)),
    (req, res, next) => {
        validateResult(req, res, next);
    },
]

module.exports = {validateName}
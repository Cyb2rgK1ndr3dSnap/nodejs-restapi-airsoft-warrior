const { Router } = require ("express");
const router = Router()

const multerUpload = require("../../utils/handleStorage")

const {
    getModes,
    getMode,
    createMode
} = require("../../controllers/v1/modes")

router
    .get(`/`, getModes)

    .get(`/:id`, getMode)

    .post(`/`, multerUpload.single('image'), createMode)

    .put(`/:id`, )
    
    .delete(`/:id`, )

module.exports = router
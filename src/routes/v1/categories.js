const { Router } = require ("express");
const router = Router()
const {
    getCategories,
    getCategorie,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../../controllers/v1/categories")

const {
    validateName,
    validateId
} = require("../../validators/categories")

router
    .get(`/`,getCategories)

    .get(`/:id`,validateId,getCategorie)

    .post(`/`,validateName,createCategory)

    .put(`/:id`,validateId,validateName,updateCategory)

    .delete(`:id`,validateId,deleteCategory)

module.exports = router
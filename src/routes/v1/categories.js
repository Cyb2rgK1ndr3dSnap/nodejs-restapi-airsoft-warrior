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
    validateName
} = require("../../validators/categories")

router
    .get(`/`,getCategories)

    .get(`/:id`,getCategorie)

    .post(`/`,validateName,createCategory)

    .put(`/:id`,updateCategory)

    .delete(`:id`,deleteCategory)

module.exports = router
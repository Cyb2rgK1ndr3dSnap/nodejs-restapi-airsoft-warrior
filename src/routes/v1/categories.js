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
    validateCreate,
    validateUpdate,
    validateId
} = require("../../validators/categories")

router
    .get(`/`,getCategories)

    .get(`/:id`,validateId,getCategorie)

    .post(`/`, validateCreate, createCategory)

    .put(`/:id`,validateId,validateUpdate,updateCategory)

    .delete(`:id`,validateId,deleteCategory)

module.exports = router
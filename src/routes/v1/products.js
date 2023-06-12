const { Router } = require ("express");
const router = Router();

const multerUpload = require("../../utils/handleStorage")

const {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../../controllers/v1/products");

const {
    validatePagination,
    validateId,
    validateCreate
} = require("../../validators/products")

router
    .get(`/`,validatePagination,getProducts)

    .get(`/:id`,validateId,getProduct)
    
    .post(`/`,validateCreate,multerUpload.single('image'),createProduct)

    .put(`/:id`,multerUpload.single('image'),validateId,updateProduct)

    .delete(`/:id`,validateId,deleteProduct)

module.exports = router



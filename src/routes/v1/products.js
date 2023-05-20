const { Router } = require ("express");
const multerUpload = require("../../utils/handleStorage")
const router = Router();
const {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../../controllers/v1/products");

const {
    validatePagination,
    validateId
} = require("../../validators/products")

router
    .get(`/`,validatePagination,getProducts)

    .get(`/:id`,validateId,getProduct)
    
    .post(`/`,multerUpload.single('image'),createProduct)

    .put(`/:id`,validateId,updateProduct)

    .delete(`/:id`,validateId,deleteProduct)

    //.get(`/`)
module.exports = router



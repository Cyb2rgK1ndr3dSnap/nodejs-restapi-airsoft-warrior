const { Router } = require ("express");
const router = Router()

const {
    createOrder,
    captureOrder,
    cancelOrder
} = require("../../controllers/v1/orders")

router
    .post(`/create-order`,createOrder)

    .get(`/capture-order`,captureOrder)

    .get(`/cancel-order`,cancelOrder)

module.exports = router
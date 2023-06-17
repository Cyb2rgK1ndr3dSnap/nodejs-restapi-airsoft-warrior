const { Router } = require ("express");
const router = Router()

const {
    createOrder,
    captureOrder,
    cancelOrder
} = require("../../controllers/v1/orders")

const {
    chechAuth
} = require("../../middleware/auth")

router
    .post(`/create-order`, chechAuth, createOrder)

    .get(`/capture-order`,captureOrder)

    .get(`/cancel-order`,cancelOrder)

module.exports = router
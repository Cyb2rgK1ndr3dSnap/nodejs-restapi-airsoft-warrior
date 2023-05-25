const { Router } = require ("express");
const multerUpload = require("../../utils/handleStorage")
const router = Router()

const {
    getPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace
} = require("../../controllers/v1/places")

router
    .get(`/`,getPlaces)

    .get(`/:id`,getPlace)

    .post(`/`,multerUpload.single('image'),createPlace)

    .put(`/:id`,multerUpload.single('image'),updatePlace)

    .delete(`/:id`,deletePlace)

module.exports = router
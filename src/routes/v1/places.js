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

    .get(`/:id`,)

    .post(`/`,multerUpload.single('image'),createPlace)

    .put(`/:id`,)

    .delete(`/:id`,)

module.exports = router
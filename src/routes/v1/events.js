const { Router } = require ("express");
const multerUpload = require("../../utils/handleStorage")
const router = Router()

const {
    getEvent,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../../controllers/v1/events")

const {
    validatePagination,
    validateId,
    validateCreate,
    validateUpdate
} = require("../../validators/events")

router
    .get(`/`, validatePagination, getEvents)

    .get(`/:id`,validateId,getEvent)

    .post(`/`,validateCreate, multerUpload.single("image"),createEvent)
    //AGREGAR ACTUALIZACIÓN DE IMAGEN
    .put(`/:id`,validateId,validateUpdate,updateEvent)

    .delete(`/:id`,validateId,deleteEvent)

module.exports = router
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
    validateId,
    validateCreate,
    validateUpdate
} = require("../../validators/events")

router
    .get(`/`,getEvents)

    .get(`/:id`,validateId,getEvent)

    .post(`/`,validateId,validateCreate,createEvent)

    .put(`/:id`,validateId,validateCreate,updateEvent)

    .delete(`/:id`,validateId,deleteEvent)

module.exports = router
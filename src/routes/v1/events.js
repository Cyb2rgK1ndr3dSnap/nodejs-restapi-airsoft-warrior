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

    .post(`/`,validateCreate,createEvent)

    .put(`/:id`,validateId,validateUpdate,updateEvent)

    .delete(`/:id`,validateId,deleteEvent)

module.exports = router
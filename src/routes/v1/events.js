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

router
    .get(`/`,getEvents)

    .get(`/:id`,getEvent)

    .post(`/`,createEvent)

    .put(`/:id`,updateEvent)

    .delete(`/:id`,deleteEvent)

module.exports = router
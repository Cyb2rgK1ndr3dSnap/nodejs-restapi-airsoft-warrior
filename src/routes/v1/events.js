const { Router } = require ("express");
const router = Router()

const {
    getEvent,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../../controllers/v1/events")

router
    .get(`/`,getEvent)

    .get(`/:id`,getEvents)

    .post(`/`,createEvent)

    .put(`/:id`,updateEvent)

    .delete(`/:id`,deleteEvent)

module.exports = router
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

    .post(`/`,multerUpload.single("image"), validateCreate, createEvent)
    
    .put(`/:id`,multerUpload.single("image"), validateId, validateUpdate, updateEvent)

    .delete(`/:id`,validateId,deleteEvent)

module.exports = router
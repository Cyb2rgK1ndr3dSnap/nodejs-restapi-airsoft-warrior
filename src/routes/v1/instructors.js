const { Router } = require ("express");
const router = Router()

const {
    getInstructors,
    getInstructor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    getProfileUser
} = require("../../controllers/v1/instructors")

const {
    validatePagination,
    validateId,
    validateCreate,
    validateUpdate
} = require("../../validators/instructors")

const {
    chechAuth
} = require("../../middleware/auth")

router
    .get(`/profile`,chechAuth, getProfileUser)

    .get(`/`, validatePagination, getInstructors)

    .get(`/:id`,validateId, getInstructor)

    .post(`/`,chechAuth, validateCreate, createInstructor)

    .put(`/:id`, validateId, validateUpdate, chechAuth, updateInstructor)
    
    .delete(`/:id`, validateId, chechAuth, deleteInstructor)

module.exports = router;
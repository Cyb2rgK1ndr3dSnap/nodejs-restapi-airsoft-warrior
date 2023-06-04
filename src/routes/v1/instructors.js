const { Router } = require ("express");
const router = Router()

const {
    getInstructors,
    getInstructor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    checkProfile,
    getProfile
} = require("../../controllers/v1/instructors")

const {
    chechAuth
} = require("../../middleware/auth")

const {
    validateId,
    validateCreate,
    validateUpdate
} = require("../../validators/instructors")

router
    .get(`/`, getInstructors)

    .get(`/:id`,validateId, getInstructor)

    .post(`/`,chechAuth, validateCreate, createInstructor)

    .put(`/:id`, validateId, validateUpdate, chechAuth, updateInstructor)
    
    .delete(`/:id`, validateId, chechAuth, deleteInstructor)

    .get(`/check`, chechAuth, checkProfile)

    .get(`/profile`, chechAuth, getProfile)

module.exports = router
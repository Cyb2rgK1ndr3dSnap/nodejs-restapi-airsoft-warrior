const { Router } = require ("express");
const router = Router()

const {
    getInstructors,
    getInstructor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    checkProfile
} = require("../../controllers/v1/instructors")

const {
    chechAuth
} = require("../../middleware/auth")

router
    .get(`/`, getInstructors)

    .get(`/:id`, getInstructor)

    .post(`/`,chechAuth, createInstructor)

    .put(`/:id`,chechAuth, updateInstructor)
    
    .delete(`/:id`,chechAuth, deleteInstructor)

    .get(`/check`, checkProfile)



module.exports = router
const { Router } = require ("express");
const router = Router()
const multerUpload = require("../../utils/handleStorage")
const {
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    getProfileTeam
} = require("../../controllers/v1/teams")

const {
    validatePagination,
    validateId,
    validateCreate,
    validateUpdate
} = require("../../validators/teams")

const {
    chechAuth
} = require("../../middleware/auth")

router
    .get(`/`, validatePagination, getTeams)

    .get(`:id`, validateId, getTeam)

    .post(`/`,chechAuth, multerUpload.single('image'), validateCreate, createTeam)

    .put(`/:id`, validateId, validateUpdate, chechAuth, updateTeam)

    .delete(`/:id`,validateId, chechAuth, deleteTeam)

    .get(`/profile`, chechAuth, getProfileTeam)

module.exports = router;
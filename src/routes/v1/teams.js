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
    chechAuth
} = require("../../middleware/auth")

router
    .get(`/`,getTeams)

    .get(`:id`,getTeam)

    .post(`/`,chechAuth,multerUpload.single('image'),createTeam)

    .put(`/:id`,chechAuth,updateTeam)

    .delete(`/:id`, chechAuth,deleteTeam)

    .get(`/profile`, chechAuth, getProfileTeam)

module.exports = router;
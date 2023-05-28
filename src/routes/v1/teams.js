const { Router } = require ("express");
const router = Router()

const {
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam
} = require("../../controllers/v1/teams")

router
    .get(`/`,getTeams)

    .get(`:id`,getTeam)

    .post(`/`,createTeam)

    .put(`/:id`,updateTeam)

    .delete(`/:id`,deleteTeam)

module.exports = router;
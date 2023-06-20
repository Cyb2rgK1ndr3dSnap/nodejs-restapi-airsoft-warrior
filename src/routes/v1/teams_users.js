const { Router } = require ("express");
const router = Router()

const {
    getMembers,
    getMember,
    createMemberRequest,
    updateMember,
    deleteMember,
    getProfileT_U
} = require("../../controllers/v1/teams_users")

const {
    chechAuth
} = require("../../middleware/auth")

router
    .get(`/profile`, chechAuth, getProfileT_U)

    .get(`/`,chechAuth, getMembers)

    .get(`/:id`,getMember)

    .post(`/`, chechAuth, createMemberRequest)
    
    .put(`/:id`, chechAuth, updateMember)
    
    .delete(`/:id`, chechAuth, deleteMember)

module.exports = router;
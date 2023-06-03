const { Router } = require ("express");
const router = Router()

const {
    getMembers,
    getMember,
    createMemberRequest,
    updateMember
} = require("../../controllers/v1/teams_users")

const {
    chechAuth
} = require("../../middleware/auth")

router
    .get(`/`,chechAuth,getMembers)

    .get(`/:id`)

    .post(`/`,chechAuth,createMemberRequest)
    
    .put(`/:id`,chechAuth,updateMember)
    
    .delete(`/:id`)

module.exports = router
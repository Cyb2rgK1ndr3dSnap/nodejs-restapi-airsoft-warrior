const {prisma} = require("../../config/connection.js")
require("dotenv/config");

const getMembers = async (req,res) =>{
    try {
        const result = await prisma.teams_users.findMany({
            where:{
                id_team:Buffer.from(bytes),
                accepted:true
            },
            select:{
                team:{
                    select:{
                        name:true,
                        image_url:true
                    }
                },
                user:{
                    select:{
                        name:true
                    }
                }
            },
        })
    
        if(result) return res.status(200).json(result)
    
        return res.status(500).json({
            isSuccess:false,
            message:"Error al obtener miembros de equipo, intentelo de nuevo o contacté con soporté"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error, comuniquese con soporte técnico"})
    }
}
//MODIFICAR EN OTRO MOMENTO
const getMember = async (req,res) =>{
    const {id} = req.params
    try {
        const result = await prisma.teams_users.findMany({
            where:{
                id_user:Buffer.from(id,'hex'),
            },select:{
                user:true,
                team:true
            }
        })
    
        if(result) return res.status(200).json(result)
    
        return res.status(500).json({
            isSuccess:false,
            message:"Error al obtener miembro de equipo, intentelo de nuevo o contacté con soporté"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error, comuniquese con soporte técnico"})
    }
}

const createMemberRequest = async (req,res) =>{
    const {id_team} = req.body
    const userIdCookie = req.userIdCookie
    try {
        const checkTeam = await prisma.teams.findFirst({
            where:{
                id:Buffer.from(id_team,'hex')
            }
        })

        if(!checkTeam) return res.status(400).json({
            isSuccess:false,
            message:"Equipo al que solicita, no existé"
        })

        const checkUser = await prisma.teams_users.findFirst({
            where:{
                OR:[
                    {
                        id_team:Buffer.from(id_team,'hex'),
                        id_user:Buffer.from(userIdCookie,'hex'),
                    },
                    {
                        id_user:Buffer.from(userIdCookie,'hex'),
                        accepted:true
                    }
                ]
            }
        })

        if(checkUser){ 
            if(checkUser.accepted === true) return res.status(400).json({
                isSuccess:false,
                message:"Ya pertenece a un equipo"
            })

            return res.status(400).json({
                isSuccess:false,
                message:"Ya ha solicitado a este equipo"
            })
        }

        const result = await prisma.teams_users.create({
            data:{
                id_team:Buffer.from(id_team,'hex'),
                id_user:Buffer.from(userIdCookie,'hex')
            }
        })

        if(result) return res.status(200).json({
            isSuccess:true,
            message:"Solicitud enviada exitosamente"
        })
        
        return res.status(500).json({
            isSuccess:false,
            message:"Error al crear solicitud, contacté con soporté técnico"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error, comuniquese con soporte técnico"
        })
    }
}

const updateMember = async (req,res) =>{
    try {
        const userIdCookie = req.userIdCookie
        const {id} = req.params
        const action = req.query.action === "1" ? true : false
        const checkTeamOwner = await prisma.teams_users.findFirst({
            where:{
                id_user:Buffer.from(id,'hex'),
                team:{
                    created_by:Buffer.from(userIdCookie,'hex')
                },NOT:{
                    id_user:Buffer.from(userIdCookie,'hex')
                }
            },
            include:{
                team:{
                    select:{
                        id:true
                    }
                }
            }
        })

        if(!checkTeamOwner) return res.status(404).json({
            isSuccess:false,
            message:"No existe está solicitud, recargé la página"
        })

        if(checkTeamOwner)
            if(checkTeamOwner.accepted != null)
                return res.status(204).json({})

            const result = await prisma.$transaction(async prisma =>{ 
                const member = await prisma.teams_users.update({
                    where:{
                        id_team_id_user:{
                            id_user:Buffer.from(id,'hex'),
                            id_team:Buffer.from(checkTeamOwner.team.id)
                        }
                    },
                    data:{
                        accepted:action
                    }
                })
                
                if(action === true){
                    await prisma.teams_users.deleteMany({
                        where:{
                            AND:{
                                    id_user:Buffer.from(checkTeamOwner.id_user),
                                },
                                OR:[
                                    {
                                        accepted:{
                                            equals:false
                                        }
                                    },
                                    {
                                        accepted:{
                                            equals:null
                                        }
                                    }
                                ] 
                        }
                    })
                }
                return member
            })      
            if(result) return res.status(204).json()

        return res.status(500).json({
            isSuccess:false,
            message:"Error al procesar petición intentelo nuevamente o contacte con soporté técnico"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error, comuniquese con soporte técnico"
        })
    }
}

const deleteMember = async (req, res) =>{
    try {
        const userIdCookie = req.userIdCookie
        const {id} = req.params
        const checkTeamOwner = await prisma.teams_users.findFirst({
            where:{
                id_user:Buffer.from(id,'hex'),
                team:{
                    created_by:Buffer.from(userIdCookie,'hex')
                },NOT:{
                    id_user:Buffer.from(userIdCookie,'hex')
                }
            },
            include:{
                team:{
                    select:{
                        id:true,
                    }
                }
            }
        })

        if(!checkTeamOwner) return res.status(404).json({
            isSuccess:false,
            message:"No existe esté usuario en el equipo, recargé la página"
        })

            const result = await prisma.teams_users.delete({
                where:{
                    id_team_id_user:{
                        id_user:Buffer.from(checkTeamOwner.id_user),
                        id_team:Buffer.from(checkTeamOwner.team.id)
                    }
                }
            })
            if(result) return res.status(204).json()

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar miembro intentelo nuevamente o contacte con soporté técnico"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error, comuniquese con soporte técnico"
        })
    }
}

const getProfileT_U = async (req, res) => {
    console.log("ENTROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    try {
        const userIdCookie = req.userIdCookie
        console.log(req.userIdCookie)
        const result = await prisma.$transaction(async prisma =>{
            const team = await prisma.teams_users.findFirst({
                where:{
                    id_user:{
                        equals:Buffer.from(userIdCookie,'hex')
                    }
                },select:{
                    team:{
                        select:{
                            id:true,
                            name:true,
                            image_url:true,
                            description:true,
                            created_by:true
                        }
                    }
                }
            })
            console.log(team)
            if(!team) return null

            const members = await prisma.teams_users.findMany({
                where:{
                    id_team:Buffer.from(team.team.id),
                    accepted:true,
                },
                select:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            image_url:true,
                            email:true
                        }
                    },
                }
            })
            return {team,members}
        })

        result.members.forEach( (value, key, map) => {
            value.user.id=value.user.id.toString('hex')
        });

        if(result){
            result.team.team.id = result.team.team.id.toString('hex')
            return res.status(200).json({result})
        }

        return res.status(404).json({
            isSuccess:false,
            message:"Not found, contacté con soporté"
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error, comuniquese con soporte técnico"
        })
    }
}

module.exports = {
    getMembers,
    getMember,
    createMemberRequest,
    updateMember,
    deleteMember,
    getProfileT_U
}
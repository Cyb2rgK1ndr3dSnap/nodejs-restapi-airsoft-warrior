const {prisma} = require("../../config/connection.js")
const uuidParse = require('uuid-parse');

const getMembers = async (req,res) =>{
    const userIdCookie = req.userIdCookie
    
    const bytes = uuidParse.parse(id_team)
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
    const id_team = req.body
    const bytes = uuidParse.parse(id_team)
    try {
        const result = await prisma.teams_users.findMany({
            where:{
                id_team:Buffer.from(bytes)
            }
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
//SEGUIR EDITANDO ESTO
const createMemberRequest = async (req,res) =>{
    const {id_team} = req.body
    const userIdCookie = req.userIdCookie
    const bytesUser = uuidParse.parse(userIdCookie);
    const bytesTeam = uuidParse.parse(id_team);
    try {
        const checkTeam = await prisma.teams.findFirst({
            where:{
                id:Buffer.from(bytesTeam)
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
                        id_team:Buffer.from(bytesTeam),
                        id_user:Buffer.from(bytesUser),
                    },
                    {
                        id_user:Buffer.from(bytesUser),
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
                id_user:Buffer.from(bytesUser),
                id_team:Buffer.from(bytesTeam)
            }
        })

        if(result) return res.status(200).json({
            isSuccess:true,
            message:"Solicitud enviada exitosamente"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error, comuniquese con soporte técnico"})
    }
}

const updateMember = async (req,res) =>{
    try {
        const userIdCookie = req.userIdCookie
        const {id} = req.params
        const action = req.query.action === "1" ? true : false
        const checkRequest = await prisma.teams_users.findUnique({
            where:{
                id:parseInt(id)
            },
            include:{
                team:{
                    select:{
                        created_by:true
                    }
                }
            }
        })

        if(checkRequest)
            if(checkRequest.accepted != null)
                return res.status(204).json({})

        const bytesCreated = uuidParse.parse(userIdCookie)
        let buffer =Buffer.from(checkRequest.team.created_by)
        let buffer2 = Buffer.from(bytesCreated)
        //console.log(Buffer.compare(buffer, buffer2))
        if(Buffer.compare(buffer, buffer2) === 0){
            const result = await prisma.$transaction(async prisma =>{ 
                const member = await prisma.teams_users.update({
                    where:{
                        id:parseInt(id)
                    },
                    data:{
                        accepted:action
                    }
                })
                
                if(action === true){
                    await prisma.teams_users.deleteMany({
                        where:{
                            AND:{
                                    id_user:Buffer.from(checkRequest.id_user),
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
        }
        return res.status(500).json({
            isSuccess:false,
            message:"Error al aceptar miembro intentelo nuevamen o contacte con soporté técnico"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error, comuniquese con soporte técnico"})
    }
}

module.exports = {
    getMembers,
    getMember,
    createMemberRequest,
    updateMember
}
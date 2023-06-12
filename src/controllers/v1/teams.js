const {prisma} = require("../../config/connection.js")
const uuidParse = require('uuid-parse');

const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js")

const getTeams = async (req,res) =>{
    try {
        const {p,s} = req.query;
        const result = await prisma.teams.findMany({
            skip: (16*(parseInt(p)-1)),
            take: 16,
            where:{
                name:{
                    contains: s || undefined
                }
            },
            select:{
                id:true,
                image_url:true,
                name:true,
                description:true,             
            }
        })

        if(result.length > 0){
            result.forEach( (value, key, map) => {
                value.id=uuidParse.unparse(value.id);
            });
            res.status(200).json(result)
        }
        res.status(404).json()
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,error:"Error al obtener los equipos, contacté a soporte"})
    }
}

const getTeam = async (req,res) => {
    const {id} = req.query;
    const bytes = uuidParse.parse(id);
    try {
        const result = await prisma.teams.findUnique({
            where:{
                id:Buffer.from(bytes)
            },
            select:{
                id:true,
                image_url:true,
                name:true,
                description:true,
                create:{
                    select:{
                        id:true,
                        name:true,
                        lastname:true,
                        image_url:true
                    }
                }
            }    
        })
        
        if(result){
            result.id = uuidParse.unparse(result.id)
            res.status(200).json(result);
        }
        res.status(404).json()
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al obtener el equipo, contacté a soporte"});
    }
}

const createTeam = async (req,res) => {
    const {name,description} = req.body
    const userIdCookie = req.userIdCookie
    const bytesUser = uuidParse.parse(userIdCookie)
    let image_url;
    try {
        const checkExist = await prisma.teams_users.findFirst({
            where:{
                    id_user:Buffer.from(bytesUser),
                    accepted:true
            },
        })

        if(checkExist)
            return res.status(400).json({
                isSuccess:false,
                message:"No puedo realizar está acción, ya pertenece a un equipo"
            })

        const checkName = await prisma.teams.findUnique({
            where:{
                name:name
            }
        })

        if(checkName) return res.status(400).json({
            isSuccess:false,
            message:"No puedo realizar está acción ya existé un equipo con ese nombre"
        })

        if(req.file){
            const path = req.file.path;
            image_url = await uploads(path,"teams");
        }else{
            image_url = {
                id:"teams/defaultteam_cv49jo",
                url:"https://res.cloudinary.com/dgfhyw8un/image/upload/v1685232562/teams/defaultteam_cv49jo.png"
            }
        }

        const result = await prisma.$transaction( async prisma =>{
            const createTeam = await prisma.teams.create({
                data:{
                    image_url,
                    name,
                    description,
                    created_by:Buffer.from(bytesUser)
                }
            })

            const createMember = await prisma.teams_users.create({
                data:{
                    id_team:Buffer.from(createTeam.id),
                    id_user:Buffer.from(bytesUser),
                    accepted:true
                }
            })
            return {createTeam,createMember}
        })

        if(result.createTeam && result.createMember) return res.status(200).json({
            isSuccess:true,
            message:"Equipo creado correctamente"
        })
        
        return res.status(500).json({
            isSuccess:false,
            message:"Error al crear Equipo, intentelo nuevamente o contacté a soporté técnico"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al crear equipo, contacté a soporte"});
    }
}
////SOLO PODER ACTUALIZAR IMAGEN DE EQUIPO
const updateTeam = async (req,res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al actualizar equipo, contacté a soporte"});
    }
}
////ELIMINAR EQUIPOS Y DESLIGAR TODOS LOS MIEMBROS DE ESE TEAM
const deleteTeam = async (req,res) => {
    try {
        const id = req.params;
        const userIdCookie = req.body

        const bytes = uuidParse.parse(id)

        const check = await prisma.teams.findUnique({
            where:{
                id:Buffer.from(bytes)
            },
            select:{
                created_by:true
            }
        })

        const createdBy = uuidParse.unparse(check.created_by)

        if(userIdCookie != createdBy) return res.status(400).json({
            isSuccess:false,
            message:"No puede eliminar este equipo, no es el creador"
        })

        const result = await prisma.$transaction( async prisma =>{
            const members = await prisma.teams_users.deleteMany({
                where:{
                    id_team:Buffer.from(bytes)
                }
            })

            const team = await prisma.teams.delete({
                where:Buffer.from(bytes)
            })
            return {members,team}
        })

        if(result.members && result.team) return res.status(204).json()

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar el equipo, intentelo de nuevo o contacte con soporter técnico"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al eliminar equipo, contacté a soporte"});
    }
}

const getProfileTeam = async (req, res) =>{
    try {
        const userIdCookie = req.userIdCookie
        const bytes = uuidParse.parse(userIdCookie)

        const result = await prisma.$transaction(async prisma=>{
            const id = await prisma.teams_users.findFirst({
                where:{
                    id_user:{
                        equals:Buffer.from(bytes)
                    }
                },select:{
                    id_team:true
                }
            })
            
            if(!id) return null

            const team = await prisma.teams.findUnique({
                where:{
                    id:Buffer.from(id.id_team),
                },
                select:{
                    id:true,
                    image_url:true,
                    name:true,
                    description:true,
                }
            })
            return {team};
        })
        
        if(result){
            result.team.id = uuidParse.unparse(result.team.id)
            return res.status(200).json(result.team)
        }

        return res.status(404).json({
            isSuccess:false,
            message:"Not found, contacté con soporté"
        })
        //ARREGLAR ESTO ##INVESTIGAR QUE RESPONSE SE DEBERÍA DAR EN STATUS 404
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al obtener Perfil de equipo, contacté a soporte"});
    }
}

module.exports = {
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    getProfileTeam
}
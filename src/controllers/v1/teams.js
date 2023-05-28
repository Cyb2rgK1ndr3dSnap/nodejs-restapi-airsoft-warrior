const {prisma} = require("../../config/connection.js")
const fs = require ('fs');
const uuidParse = require('uuid-parse');


const getTeams = async (req,res) =>{
    try {
        const result = await prisma.teams.findMany({})
        result.forEach( (value, key, map) => {
            value.id=uuidParse.unparse(value.id);
        });
        res.status(200).json(result)
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
            }
        })
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al obtener el equipo, contacté a soporte"});
    }
}
/////////////////TERMINAR
const createTeam = async (req,res) => {
    const {name,description,userCookieId} = req.body
    const bytes = uuidParse.parse(userCookieId)
    let image_url;
    try {
        const checkExist = await prisma.teams_users.findUnique({
            where:{
                id:Buffer.from(bytes),
                accepted:true
            }
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

        if(checkExist)
            return res.status(400).json({
                isSuccess:false,
                message:"No puedo realizar está acción ya pertenece a un equipo"
            })
        //FALTAAAAAAAAAAAAAAAAAAAAAAAAA
        const result = await prisma.teams.create({
            data:{

            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({isSuccess:false,error:"Error al crear equipo, contacté a soporte"});
    }
}

module.exports = {
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
}
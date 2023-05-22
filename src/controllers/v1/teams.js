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

const createTeam = (req,res) => {
    
    try {
        
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
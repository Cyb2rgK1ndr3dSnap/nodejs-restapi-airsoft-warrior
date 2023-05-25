const {prisma} = require("../../config/connection")

const uuidParse = require('uuid-parse');

const getEvents = async (req,res) =>{
    try {
        const result = prisma.events.findMany({
            include:{
                places:true,
            }
        })
        result.forEach( (value, key, map) => {
            value.id=uuidParse.unparse(value.id);
          });
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener los eventos, contacté con soporté"
        })
    }
}

const getEvent = async (req,res) =>{
    try {
        const {id} = req.query
        const bytes = uuidParse.parse(id)
        const result = await prisma.events.findUnique({
            where:{
                id:Buffer.from(bytes)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener evente, contacté con soporté"
        })
    }
}

const createEvent = async (req,res) =>{
    try {
        const {id_place,description,price,fecha_de_evento} = req.body
        const result = await prisma.events.create({
            data:{
                id_place,
                description,
                price,
                fecha_de_evento
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al crear evente, contacté con soporté"
        })
    }
}

const updateEvent = async (req,res) => {
    try {
        const {id} = req.query
        const {id_place,description,price,fecha_de_evento} = req.body
        const bytes = uuidParse.parse(id)
        const result = await prisma.events.update({
            where:Buffer.from(bytes),
            data:{
                id_place: id_place || undefined,
                description : description || undefined,
                price: price || undefined,
                fecha_de_evento: fecha_de_evento || undefined
            }
        })
        if(result) return res.status(204)

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar evente, contacté con soporté"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al actualizar evente, contacté con soporté"
        })
    }
}

const deleteEvent = async (req,res) => {
    try {
        const {id} = req.body
        const bytes = uuidParse.parse(id)
        const result = await prisma.events.delete({
            where:{
                id:Buffer.from(bytes)
            }
        })
        if(result) return res.status(204)

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar evente, contacté con soporté"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar evente, contacté con soporté"
        })
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}
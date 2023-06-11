const {prisma} = require("../../config/connection")

const uuidParse = require('uuid-parse');

const getEvents = async (req,res) =>{
    try {
        const {p,s} = req.query;
        const result = await prisma.events.findMany({
            skip: (16*(parseInt(p)-1)),
            take: 16,
            where:{
                name:{
                    contains: s || undefined
                }
            },
            include:{
                place:true,
            }
        });

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
        const {id} = req.params
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
        const {id_place,name,description,price,fecha_de_evento} = req.body
        const result = await prisma.events.create({
            data:{
                name:name,
                id_place:parseInt(id_place),
                description,
                price,
                fecha_de_evento:new Date(fecha_de_evento)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al crear evento, contacté con soporté"
        })
    }
}

const updateEvent = async (req,res) => {
    try {
        const {id} = req.params
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
        if(result) return res.status(204).json()

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
        const {id} = req.params
        const bytes = uuidParse.parse(id)
        const result = await prisma.events.delete({
            where:{
                id:Buffer.from(bytes)
            }
        })
        if(result) return res.status(204).json()

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
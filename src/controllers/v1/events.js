const {prisma} = require("../../config/connection")
const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js");

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
            select:{
                id:true,
                price:true,
                fecha_de_evento:true,
                place:true
            }
        });
        if(result.length > 0){
            result.forEach( (value, key, map) => {
                value.id = value.id.toString('hex')
            });
            return res.status(200).json(result)
        }
        return res.status(404).json()
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
        //const bytes = uuidParse.parse(id)
        const result = await prisma.events.findUnique({
            where:{
                id:Buffer.from(id,'hex')
            },
            select:{
                name:true,
                id:true,
                price:true,
                fecha_de_evento:true,
                description:true,
                place:true,
                events_modes:{
                    select:{
                        mode:{
                            select:{
                                name:true,
                                image_url:true
                            }
                        }
                    }
                }
            }
        })
        if(result){
            //result.id = uuidParse.unparse(result.id)
            result.id = result.id.toString('hex')
            return res.status(200).json(result)
        }
        return res.status(404).json()
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
        const {id_place,name,description,price,fecha_de_evento,modes} = req.body
        let image_url;

        if(req.file){
            const path = req.file.path;
            image_url = await uploads(path,"events");
        }else{
            image_url = {
                id:"events/defaultevent_mxajmg",
                url:"https://res.cloudinary.com/dgfhyw8un/image/upload/v1686849926/events/defaultevent_mxajmg.png"
            }
        }

        const result = await prisma.$transaction( async prisma =>{
            data = []
            const event = await prisma.events.create({
                data:{
                    image_url,
                    name:name,
                    id_place:parseInt(id_place),
                    description,
                    price,
                    fecha_de_evento:new Date(fecha_de_evento),
                }
            })

            await modes.forEach((value) => {
                data.push({id_event:event.id,id_mode:parseInt(value.id)})
            })

            await prisma.events_modes.createMany({
                data:data
            })

            return {event}
        })
        
        if(result) return res.status(200).json(result)

        return res.status(400).json()
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
        const {id} = req.params;
        const {id_place,description,price,fecha_de_evento} = req.body;
        let image_url;
        let response;

        if(req.file){
            const path = req.file.path;
            const product = await prisma.products.findUnique({
                where:{
                    id:Buffer.from(id,'hex')
                },
                select:{
                    image_url:true
                }
            })
            image_url = await uploads(path, 'products');
            if(!image_url){
                return res.status(500).json({isSuccess:false,message:"Error al cargar imagen"})
            }
            response = await deletes(product.image_url.id)
        }
        if(req.file===undefined || response.response === "ok" || response.response === "not found"){
            const result = await prisma.events.update({
                where:Buffer.from(id,'hex'),
                data:{
                    id_place: id_place || undefined,
                    description : description || undefined,
                    price: price || undefined,
                    fecha_de_evento: fecha_de_evento || undefined
                }
            })
            if(result) 
                return res.status(204).json()
        }

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
        const result = await prisma.events.delete({
            where:{
                id:Buffer.from(id,'hex')
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
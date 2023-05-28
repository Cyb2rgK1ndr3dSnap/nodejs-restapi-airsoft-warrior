const {prisma} = require("../../config/connection.js")
const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js");

const fs = require ('fs');

const getPlaces = async (req,res) => {
    try {
        const result = await prisma.places.findMany({})
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            isSucces:false,
            message:"Error al obtener lugares, contacté con soporte técnico"
        })
    }
}

const getPlace = async (req,res) => {
    const {id} = req.query
    try {
        const result = await prisma.places.findUnique({
            where:{
                id
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSucces:false,
            message:"Error al obtener lugar, contacté con soporte técnico"
        })
    }
}

const createPlace = async (req,res) =>{
    try {
        const path = req.file.path
        const {name,description,ubication,latitude,longitude,ambiente} = req.body
        const image_url = await uploads(path,"places");
        //const { path } = file;
        //fs.unlinkSync(path);
        if(image_url.url){
            const result = await prisma.places.create({
                data:{
                    name,
                    image_url,
                    description,
                    ubication,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    ambiente
                }
            })
            return res.status(200).json(result)
        }
        return res.status(500).json({
            isSucces:false,
            message:"Error al cargar imagen"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSucces:false,
            message:"Error al guardar lugar, contacté con soporte técnico"
        })
    }
}

const updatePlace = async (req,res) =>{
    const path = req.file.path
    const {id} = req.query
    const {name,description,ubication,latitude,longitude,ambiente} = req.body
    let image_url = {}
    let response = "";
    try {
        
        if(path){
            image_url = await uploads(path,"places")

            const product = await prisma.places.findUnique({
                where:{
                    id:id
                },
                select:{
                    image_url:true
                }
            })

            response = await deletes(product.image_url.id)
            console.log(response)
        }

        if(path===undefined || response === "ok" || response === "not found"){
            const result = await prisma.places.update({
                where:{
                    id:id
                },
                data:{
                    name: name || undefined,
                    image_url: image_url || undefined,
                    description: description || undefined,
                    ubication: ubication || undefined,
                    latitude: parseFloat(latitude) || undefined,
                    longitude: parseFloat(longitude) || undefined,
                    ambiente: ambiente || undefined
                }
            })
            console.log(result)
            if(result){
                //return res.status(200).json({message:"Información actualizada correctamente"})
                return res.status(204).json()
            }
            return res.status(500).json({message:"Error al actualizar información"})
        }
    } catch (error) {
        console.log(e)
        res.status(500).json({isSuccess:false,message:"Error al actualizar lugar, comuniquese con soporte técnico"})
    }
}

const deletePlace = async (req,res) =>{
    const {id} = req.query
    try {
        const result = await prisma.places.delete({
            where:{
                id:id
            }
        })
        if(result) return res.status(204).json()

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar lugar, contactee con soporte técnico"
        })
    } catch (error) {
        console.log(e)
        res.status(500).json(error)
    }
}

module.exports = {
    getPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace
}
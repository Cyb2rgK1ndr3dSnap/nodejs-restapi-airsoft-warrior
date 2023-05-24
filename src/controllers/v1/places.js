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
    const file = req.file
    const {name,description,ubication,latitude,longitude,ambiente} = req.body
    try {
        const { path } = file;
        const image_url = await uploads(path,"places");
        fs.unlinkSync(path);
        if(image.url){
            const result = await prisma.places.create({
                data:{
                    name,
                    image_url,
                    description,
                    ubication,
                    latitude,
                    longitude,
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
        console.log(e)
        res.status(500).json(error)
    }
}

const updatePlace = (req,res) =>{

}

const deletePlace = (req,res) =>{

}

module.exports = {
    getPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace
}
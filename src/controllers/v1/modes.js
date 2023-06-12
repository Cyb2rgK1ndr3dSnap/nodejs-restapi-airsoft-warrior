const {prisma} = require("../../config/connection.js")
const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js");

const getModes = async (req, res) =>{
    try {
        const result = await prisma.modes.findMany({})
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al obtener modos de juego, contacté con soporté',
        })
    }
}

const getMode = async (req, res) =>{
    try {
        const {id} = req.body
        const result = await prisma.modes.findUnique({
            where:{
                id:parseInt(id)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al obtener modo de juego, contacté con soporté',
        })
    }
}

const createMode = async (req, res) =>{
    try {
        if(!req.file) return res.status(400).json({
            isSuccess:false,
            message:"La imagen del modo de juego es requerida"
        })

        const path = req.file.path;
        const {name,description} = req.body
        const image_url = await uploads(path, 'modes');

        if(image_url.url){
            const result = await prisma.modes.create({
                data:{
                    name:name,
                    description:description,
                    image_url
                }
            })
            return res.status(200).json(result)
        }
        return res.status(500).json({
            isSuccess: false,
            error:"Error al crear modo de juego"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al crear modo de juego, contacté con soporté',
        })
    }
}
//###DESARROLLAR UPDATE AND DELETE
const updateMode = async (req, res)=>{
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al actualizar modo de juego, contacté con soporté',
        })
    }
}

const deleteMode = async (req, res) =>{
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al eliminar modo de juego, contacté con soporté',
        })
    }
}

module.exports = {
    getModes,
    getMode,
    createMode
}
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
        const {id} = req.params;
        const {name,description} = req.body;
        let image_url;
        let response = "";
        if(req.file){
            const path = req.file.path;
            const mode = await prisma.products.findUnique({
                where:{
                    id:Buffer.from(id,'hex')
                },
                select:{
                    image_url:true
                }
            })
            image_url = await uploads(path, 'modes');
            if(!image_url){
                return res.status(500).json({
                    isSuccess:false,
                    message:"Error al cargar imagen"
                })
            }
            response = await deletes(mode.image_url.id)
        }

        if(req.file===undefined || response.response === "ok" || response.response === "not found"){
            const result = prisma.modes.update({
                where:{
                    id:Buffer.from(id,'hex')
                },
                data:{
                    name: name || undefined,
                    description: description || undefined,
                    image_url: image_url || undefined
                }
            })
            if(result){
                return res.status(204).json()
            }
        }
        return res.status(500).json({
            isSucces:false,
            message:"Error al actualizar información"
        })
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
        const{id}= req.params
        const result = await prisma.modes.findUnique({
            where:{
                id:Buffer.from(id,'hex'),
            },
            select: {
                image_url:true
            },
        })
        const response = await deletes(result.image_url.id)
        if(response.response === "ok" || response.response === "not found"){
            const result2 = await prisma.modes.delete({
                where:  {
                    id:Buffer.from(id,'hex'),
                }
            })   
            if(result2) return res.status(204).json()
        }
        
        res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar modo de juego"
        })
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
    createMode,
    updateMode,
    deleteMode
}
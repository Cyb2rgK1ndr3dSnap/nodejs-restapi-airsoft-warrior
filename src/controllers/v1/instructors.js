const {prisma} = require("../../config/connection")
const uuidParse = require('uuid-parse');

const getInstructors = async (req, res) => {
    try {
        const {p,s} = req.query;
        const result = await prisma.instructors.findMany({
            skip: (16*(parseInt(p)-1)),
            take: 16,
            where:{
                user:{
                    name:{
                        contains: s || undefined
                    }
                }
            },
            select:{
                user:{
                    select:{
                        image_url:true,
                        name:true,
                        lastname:true,
                        age:true,
                        phonenumber:true,
                        email:true
                    }
                }
            }
        })

        if(result.length > 0){
            result.forEach( (value, key, map) => {
                value.id_user=uuidParse.unparse(value.id_user);
            });
            return res.status(200).json(result)
        }

        return res.status(404).json(result)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener los instructores, contacté con soporté"
        })
    }
}

const getInstructor = async (req, res) => {
    try {
        const {id} = req.params
        const bytes = uuidParse.parse(id)
        const result = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(bytes)
            },include:{
                user:{
                    select:{
                        image_url:true,
                        name:true,
                        lastname:true,
                        age:true,
                        phonenumber:true,
                        email:true
                    }
                }
            }
        })
        if(result){
            result.id_user = uuidParse.unparse(result.id_user)
            return res.status(200).json(result)
        }
        return res.status(404).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener el instructor, contacté con soporté"
        })
    }
}

const createInstructor = async (req, res) => {
    try {
        const {video_url,description,specialist} = req.body
        const userIdCookie = req.userIdCookie
        const bytes = uuidParse.parse(userIdCookie)
        const instructor = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(bytes)
            }
        })

        if(instructor) return res.status(500).json({
            isSuccess:false,
            message:"Error al crear perfil de instructor, ya ha creado uno anteriormente"
        })

        const result = await prisma.instructors.create({
            data:{
                id_user:Buffer.from(bytes),
                video_url: video_url || undefined,
                description,
                specialist
            }
        })

        if(result) return res.status(200).json({isSuccess:true,message:"Perfil de instructor creado exitosamente"})

        return res.status(500).json({isSuccess:false,message:"Error al crear Perfil de instructor"})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al crear Perfil de instructor, contacté con soporté"
        })
    }
}

const updateInstructor = async (req, res) => {
    try {
        const {id} = req.params
        const {video_url,description,specialist} = req.body
        const userIdCookie = req.userIdCookie

        if(id !== userIdCookie) return res.status(500).json({
            isSuccess:false,
            message:"No puede actualizar el Perfil de ese instructor"
        })

        const bytes = uuidParse.parse(userIdCookie)
        const result = await prisma.instructors.update({
            where:{
                id_user:Buffer.from(bytes)
            },
            data:{
                video_url: video_url || undefined,
                description: description || undefined,
                specialist: specialist || undefined
            }
        })

        if(result) return res.status(204).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener los instructores, contacté con soporté"
        })
    }
}

const deleteInstructor = async (req, res) => {
    try {
        const {id} = req.params
        const userIdCookie = req.userIdCookie

        if(id !== userIdCookie) return res.status(500).json({
            isSuccess:false,
            message:"No puede eliminar el Perfil de ese instructor"
        })

        const bytes = uuidParse.parse(userIdCookie)

        const result = await prisma.instructors.delete({
            where:{
                id_user:Buffer.from(bytes)
            }
        })
        
        if(result) return res.status(204).json()

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar el Perfil de instructor"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener los instructores, contacté con soporté"
        })
    }
}

const checkProfile = async (req, res) => {
    try {
        const userIdCookie = req.userIdCookie
        const bytes = uuidParse.parse(userIdCookie)
        const checkExist = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(bytes)
            }
        })
        if(checkExist) return res.status(200).json({
            isSuccess:true,
            message:"Existé el perfil"
        });

        return res.status(404).json({
            isSuccess:false,
            message:"Existé el perfil"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener los instructores, contacté con soporté"
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const userIdCookie = req.userIdCookie
        const bytes = uuidParse.parse(userIdCookie)
        const result = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(bytes)
            },include:{
                user:{
                    select:{
                        id:true,
                        image_url:true,
                        name:true,
                        lastname:true,
                        age:true,
                        phonenumber:true,
                        email:true
                    }
                }
            }
        })
        if(result){
            const uuid = uuidParse.unparse(result.id_user)
            result.id_user = uuid
            return res.status(200).json(result)
        }
        return res.status(404).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener Perfil de instructor, contacté con soporté"
        })
    }
}

module.exports = {
    getInstructors,
    getInstructor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    checkProfile,
    getProfile
}
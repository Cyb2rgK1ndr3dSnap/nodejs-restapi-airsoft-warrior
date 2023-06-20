const {prisma} = require("../../config/connection");
require("dotenv/config");

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
            include:{
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
                value.id_user= value.id_user.toString('hex');
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
        const result = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(id,'hex')
            },select:{
                video_url:true,
                description:true,
                total:true,
                specialist:true,
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
            //result.id_user = result.id_user.toString('hex')
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
        const instructor = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(userIdCookie,'hex')
            }
        })

        if(instructor) return res.status(500).json({
            isSuccess:false,
            message:"Error al crear perfil de instructor, ya ha creado uno anteriormente"
        })

        const result = await prisma.instructors.create({
            data:{
                id_user:Buffer.from(userIdCookie,'hex'),
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

        const result = await prisma.instructors.update({
            where:{
                id_user:Buffer.from(userIdCookie,'hex')
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

        const result = await prisma.instructors.delete({
            where:{
                id_user:Buffer.from(userIdCookie,'hex')
            }
        })
        
        if(result) return res.status(204).json({});

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar el Perfil de instructor"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess:false,
            message:"Error al obtener los instructores, contacté con soporté"
        })
    }
}

const getProfileUser = async (req, res) => {
    try {
        const userIdCookie = req.userIdCookie
        const result = await prisma.instructors.findUnique({
            where:{
                id_user:Buffer.from(userIdCookie,'hex')
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
            result.id_user = result.id_user.toString('hex')
            return res.status(200).json(result)
        }

        return res.status(404).json({})
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
    getProfileUser
}
const { prisma } = require('../../config/connection.js');

const getCategories = async(req,res,next) => {
    const result = await prisma.categories.findMany()
    //res.redirect("https://youtube.com")
    res.status(200).json(result);
    //res.cookie('Prueba',"TESTING-COOKI",{ expires: new Date(Date.now() + 10000), httpOnly: true })
    //next();
}

const getCategorie = async(req,res)=>{
    const {id} = req.params;
    const result = await prisma.categories.findUnique({
        where:{
            id:parseInt(id)
        }
    })
    res.status(200).json(result)
}

const createCategory = async(req,res)=>{
    const {name} = req.body
    const result = await prisma.categories.create({
        data:{
            name
        }
    })
    if(result){
        res.status(200).json(result)
    }else{
        res.status(404).json({message:"No se ha encontrado"})
    }
}

const updateCategory = async(req,res)=>{
    const {id} = req.params;
    const {name} = req.body;
    try{
        const result = await prisma.categories.update({
            where:{
                id:parseInt(id)
            },
            data:{
                name:name
            }
        })
        if(result) return res.status(204).json()

    return res.status(500).json({
        isSuccess:false,
        message:"Error al actualizar categoria"
    })
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

const deleteCategory = async(req,res)=>{
    const {id} = req.params;
    try {
        const result = await prisma.categories.delete({
            where:{
                id:parseInt(id)
            }
        })
        if(result) return res.status(204).json()

        return res.status(500).json({
            isSuccess:false,
            message:"Error al eliminar categoria, intentelo de nuevo o contacté con soporté"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

module.exports = {
    getCategories,
    getCategorie,
    createCategory,
    updateCategory,
    deleteCategory
}
const { prisma } = require('../../config/connection.js');

const getCategories = async(req,res,next) => {
    const result = await prisma.categories.findMany({})
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
    const result = await prisma.categories.update({
        where:{
            id:parseInt(id)
        },
        data:{
            name:name
        }
    })
    res.status(204)
}

const deleteCategory = async(req,res)=>{
    const {id} = req.params;
    const result = await prisma.categories.delete({
        where:{
            id:parseInt(id)
        }
    })
    res.status(204)
}

module.exports = {
    getCategories,
    getCategorie,
    createCategory,
    updateCategory,
    deleteCategory
}
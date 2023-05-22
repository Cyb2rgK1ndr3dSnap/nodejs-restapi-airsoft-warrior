const { prisma } = require('../../config/connection.js');
const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js");

const fs = require ('fs');
const uuidParse = require('uuid-parse');

const getProducts = async (req ,res)=>{
    const {pagination,tags,order,prices} = req.query;
    //console.log("MULTIPLACIÓN"+((16*(parseInt(pagination)-1))+1))
    const result = await prisma.products.findMany({
        skip: (16*(parseInt(pagination)-1)),
        take: 16,
        where:{
            id_category:parseInt(tags)||undefined
        },
        orderBy:{
            name: order,
        }
    })
    result.forEach( (value, key, map) => {
        value.id=uuidParse.unparse(value.id);
      });
    res.json(result);
}

const getProduct = async (req ,res)=>{
    const{id} = req.params;
    const bytes = uuidParse.parse(id);
    const result = await prisma.products.findUnique({
        where: {
            id:Buffer.from(bytes),
        },
        select: {
            id:true,
            id_category:true,
            name:true,
            image_url:true,
            description:true,
            price:true,
            stock:true
        },
    })
    const uuid = uuidParse.unparse(result.id)
    result.id = uuid
    res.json(result);
}

const createProduct = async (req, res)=>{
    const uploader = async (path) => await uploads(path, 'products');
    try{
        const file = req.file;
        const{id_category,name,description,price,stock,active}= req.body;
            const { path } = file;
            const image_url = await uploader(path)
            //console.log(image_url)
            fs.unlinkSync(path)
            if(image_url.url){
                const result = await prisma.products.create({
                    data: {
                        id_category:parseInt(id_category),
                        image_url,
                        name,
                        description,
                        price,
                        stock:parseInt(stock),
                        active:Boolean(active)
                    }
                })
                res.status(200).json(result);
            }else{
                res.status(500).json({
                    isSuccess: false,
                    error:"Error al cargar imagen"
                });
            }
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:'error',
        })
    }
}

const updateProduct = async (req,res)=>{
    const{id}= req.params;
    const{body} = req.body;
    const bytes = uuidParse.parse(id);
    const result = await prisma.products.update({
        where : {
            id:Buffer.from(bytes)
        },
        data:{
            id_category:body.id_category || undefined,
            image_url: url || undefined,
            name:body.name || undefined,
            description:body.description || undefined,
            price:body.price || undefined,
            stock:body.stock || undefined,
            active:body.active || undefined
        }
    })
    if(result){
        res.status(200).json({message:"Información actualizada correctamente"})
    }else{
        res.status(500).json({message:"Error al actualizar información"})
    }    
}

const deleteProduct = async (req,res)=>{
    const{id}= req.params
    const bytes = uuidParse.parse(id);
    const result = await prisma.products.findUnique({
        where:{
            id:Buffer.from(bytes),
        },
        select: {
            image_url:true
        },
    })
    const response = await deletes(result.image_url.id)
    if(response.response === "ok"){
        const result2 = await prisma.products.delete({
            where:  {
                id:Buffer.from(bytes),
            }
        })
        res.status(200).json(result2)
    }else{
        res.status(500).json({message:"Error al eliminar imagen"})
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}


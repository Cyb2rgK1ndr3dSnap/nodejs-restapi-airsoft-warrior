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
            id_category:parseInt(tags)|| undefined
        },
        orderBy:[{
            name: order || undefined,
            price: prices || undefined
        }]
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
    try{
        const path = req.file.path;
        const{id_category,name,description,price,stock,active}= req.body;
        const image_url = await uploads(path, 'products');
            //const { path } = file;
            //fs.unlinkSync(path)
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
                return res.status(200).json(result);
            }
                return res.status(500).json({
                    isSuccess: false,
                    error:"Error al cargar imagen"
                });
    }catch(error){
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'error',
        })
    }
}

const updateProduct = async (req,res)=>{
    const path = req.file.path;
    const{id}= req.params;
    const{id_category,name,description,price,stock,active} = req.body;
    const bytes = uuidParse.parse(id);
    let image_url= {};
    let response = "";
    try{
        if(path){
            const product = await prisma.products.findUnique({
                where:{
                    id:Buffer.from(bytes)
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
            console.log(response)
        }

        if(path===undefined || response.response === "ok" || response.response === "not found"){
            const result = await prisma.products.update({
                where : {
                    id:Buffer.from(bytes)
                },
                data:{
                    id_category:id_category || undefined,
                    image_url: image_url || undefined,
                    name:name || undefined,
                    description:description || undefined,
                    price:price || undefined,
                    stock:stock || undefined,
                    active:active || undefined
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
    }catch(error){
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error al actualizar producto, comuniquese con soporte técnico"})
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
    if(response.response === "ok" || response.response === "not found"){
        const result2 = await prisma.products.delete({
            where:  {
                id:Buffer.from(bytes),
            }
        })   
        if(result2) return res.status(204).json()
    }
    
    res.status(500).json({
        isSuccess:false,
        message:"Error al eliminar imagen"
    })
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}


const { prisma } = require('../../config/connection.js');
const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js");

const uuidParse = require('uuid-parse');

const getProducts = async (req ,res)=>{
    try {
        const {p,tags,s} = req.query;
        let orderBySet = {};
        for(const [key, value] of Object.entries(req.query)) {
            if((key == "price" || key == "name") && value){
                if(Object.keys(orderBySet).length == 0) orderBySet[`${key}`]=value;
            }
        } 
        const result = await prisma.products.findMany({
            skip: (16*(parseInt(p)-1)),
            take: 16,
            where:{
                id_category:parseInt(tags)|| undefined,
                name: {
                    contains: s || undefined
                }
            },
            orderBy:orderBySet
        })
        
        if(result.length > 0){
            result.forEach( (value, key, map) => {
                value.id=uuidParse.unparse(value.id);
            });
            return res.status(200).json(result);
        }

        return res.status(404).json()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al obtener productos, contacté con soporté',
        })
    }
}

const getProduct = async (req ,res)=>{
    try {
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

        if(result){
            result.id = uuidParse.unparse(result.id)
            return res.status(200).json(result);
        }

        return res.status(500).json({
            isSuccess: false,
            error:"Error al crear producto"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al obtener productos, contacté con soporté',
        })
    }
}

const createProduct = async (req, res)=>{
    try{
        if(!req.file) return res.status(400).json({
            isSuccess:false,
            message:"La imagen del producto es requerida"
        })
        const path = req.file.path;
        const{id_category,name,description,price,stock,active}= req.body;
        const image_url = await uploads(path, 'products');

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
                    error:"Error al crear producto"
                });
    }catch(error){
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message:'Error al crear producto, contacté con soporté técnico',
        })
    }
}

const updateProduct = async (req,res)=>{
    const{id}= req.params;
    const{id_category,name,description,price,stock,active} = req.body;
    const bytes = uuidParse.parse(id);
    let image_url= {};
    let response = "";
    try{
        if(req.file){
            const path = req.file.path;
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
        }

        if(req.file===undefined || response.response === "ok" || response.response === "not found"){
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
        message:"Error al eliminar producto"
    })
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}


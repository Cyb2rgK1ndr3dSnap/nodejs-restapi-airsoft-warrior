const { prisma } = require("../../config/connection")
require("dotenv/config")
const uuidParse = require('uuid-parse');
const axios = require("axios");
const { uploads } = require("../../utils/handleCloudinary");

const auth = {username:process.env.PAYPAL_CLIENT_ID,password:process.env.PAYPAL_CLIENT_SECRET}
const params = new URLSearchParams();
params.append("grant_type", "client_credentials");

const createOrder = async (req, res) => {
    try{
    //[id,id,id,id,id,id]
    const {order} = req.body;
    let check;
    
    order.forEach( (value, key, map) => {
        value.id=uuidParse.parse(value.id);
    });
    
    const result = await prisma.products.findMany({
        where:{
            id: { 
                in: order.map(product => Buffer.from(product.id)) 
            }
        },
        select:{
            id:true,
            name:true,
            price:true,
            stock:true
        }
    })
    
    await order.forEach(async (value,index,arr) => {
        return result.forEach((valuedb)=>{
            if(Buffer.compare(Buffer.from(value.id),Buffer.from(valuedb.id))===0){
                //console.log(`Cantidad en stock ${valuedb.stock}, cantidad del pedido ${value.quantity}`)
                if(parseInt(valuedb.stock)>=parseInt(value.quantity)){
                    valuedb.stock = parseInt(value.quantity)
                }else{
                    arr.length = index + 1
                    check = false
                    //console.log("MAYOR A STOCK")
                }
            }
        })
    })
    
    if(check === false) return res.status(500).json({
        isSuccess:false,
        message:"No hay suficiente productos en stock"
    })
    const total = result.reduce((a,b)=>  a + b.price * b.stock,0).toFixed(2)

    result.forEach( (value, key, map) => {
        value.id=uuidParse.unparse(value.id);
    });

    const body = {
        "intent":"CAPTURE",
        "purchase_units":[
            {
                //"reference_id": "PUHF",
                "description": "Some description",
                "custom_id": "Something7364",
                "soft_descriptor": "Great description 1",
                "amount": {
                    "currency_code":"USD",
                    "value":total,
                    "breakdown":{
                        "item_total":{
                            "currency_code":"USD",
                            "value": total
                        }
                    }
                },  
                "items": []
            }
        ],
        application_context: {
            brand_name: `Airsoft Warriors`,
            landing_page: `NO_PREFERENCE`,
            user_action:`PAY_NOW`,
            return_url:`${process.env.UI_ROOT_URI}/api/orders/capture-order`,
            cancel_url:`${process.env.UI_ROOT_URI}/api/orders/cancel-order`
        }
    }

    result.map((product)=> body.purchase_units[0].items.push({
        name:product.name,
        sku:product.id,
        quantity:product.stock,
        unit_amount:{
            currency_code:"USD",
            value:product.price// is the quantity of the user required
        }
    }))

    //const params = new URLSearchParams();
    //params.append("grant_type", "client_credentials");

    const {
        data: {access_token},
    } = await axios.post(
        `${process.env.PAYPAL_API}/v1/oauth2/token`,
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth
        }
    )
    
    
    const payment = await axios
        .post(
            `${process.env.PAYPAL_API}/v2/checkout/orders`, 
        body,
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        },
    )
    //.then((response) => res.redirect(response.data.links[1].href))
    .then((response) => res.status(200).json({data: response.data}))
    }catch(error){
        console.log(`Failed to fetch order`);
        console.log(error.response.data.details)
        res.status(500).json({isSuccess:false,message:"Algo ha fallado, intentelo de nuevo"})
    }
}

const captureOrder = async (req, res) =>{
    const { token } = req.query;
    let updates = [];
    //`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    try {
        const response = await axios.get(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${token}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth
            }
        );

        response.data.purchase_units[0].items.map(product => {
            updates.push(prisma.products.update({
                where: {
                    id: Buffer.from(uuidParse.parse(product.sku))
                },
                data:{
                    stock:{
                        decrement: parseInt(product.quantity)
                    }
                }
            }))
        })

        const result = await prisma.$transaction(updates)

        res.status(200).json(response.data)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error recargé la página, comuniquese con soporte técnico"})
    }
}

const cancelOrder = async (req, res) =>{
    
}

module.exports = {
    createOrder,
    captureOrder,
    cancelOrder
}
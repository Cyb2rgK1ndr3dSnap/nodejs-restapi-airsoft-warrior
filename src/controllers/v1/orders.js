const { prisma } = require("../../config/connection")
require("dotenv/config")
const uuidParse = require('uuid-parse');
const axios = require("axios");
const { Result } = require("express-validator");

const auth = {username:process.env.PAYPAL_CLIENT_ID,password:process.env.PAYPAL_CLIENT_SECRET}

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
                console.log(`Cantidad en stock ${valuedb.stock}, cantidad del pedido ${value.quantity}`)
                if(parseInt(valuedb.stock)>=parseInt(value.quantity)){
                    valuedb.stock = parseInt(value.quantity)
                }else{
                    arr.length = index + 1
                    check = false
                    console.log("MAYOR A STOCK")
                }
            }
        })
    })

    console.log(result)
    console.log(check)
    
    if(check === false) return res.status(500).json({
        isSuccess:false,
        message:"No hay suficiente productos en stock"
    })
    
    return res.status(200).json({
        isSuccess:true,
        message:"All rigth"
    })
    const body = {
        "intent":"CAPTURE",
        "purchase_units":[
            {
                "reference_id": "PUHF",
                "description": "Some description",
                "custom_id": "Something7364",
                "soft_descriptor": "Great description 1",
                "amount": {
                    "currency_code":"USD",
                    "value":"600.00",
                    "breakdown":{
                        "item_total":{
                            "currency_code":"USD",
                            "value": "600.00"
                        }
                    }
                },  
                "items": [
                    {
                        "name":"This is a example 1",
                        "quantity":"1",
                        "unit_amount":{
                            "currency_code": "USD",
                            "value": "200.00"
                        }
                    },
                    {
                        "name":"This is a example 2",
                        "quantity":"2",
                        "unit_amount":{
                            "currency_code": "USD",
                            "value": "200.00"
                        }
                    }
                ]
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

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
        data: { access_token},
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
    .then((response) => res.status(200).json({data: response.data}))
    }catch(error){
        console.log(`Failed to fetch order`);
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Algo ha fallado, intentelo de nuevo"})
    }
    /*
    .catch((error) => {
        console.error(`Failed to fetch order`);
        res.status(500).json({isSuccess:false,message:"Algo ha fallado, intentelo de nuevo"})
        //throw new Error(error);
    });*/
}

const captureOrder = async (req, res) =>{
    const { token } = req.query;

    try {
        const response = await axios.post(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
                auth
            }
        );

        console.log(response.data)

        res.status(200).json({data:response.data})
        
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
const { prisma } = require("../../config/connection")
const axios = require("axios");
require("dotenv/config")

const auth = {username:process.env.PAYPAL_CLIENT_ID,password:process.env.PAYPAL_CLIENT_SECRET}
const params = new URLSearchParams();
params.append("grant_type", "client_credentials");

const createOrder = async (req, res) => {
    try{
    //[id,id,id,id,id,id]
    const {order} = req.body;
    const userIdCookie = req.userIdCookie
    let check;
    
    //VALIDAR QUE ORDER CONTENGA id y quantity en todos los campos
    
    const result = await prisma.products.findMany({
        where:{
            id: {
                in: order.map(product => Buffer.from(product.id,'hex')) 
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
            if(Buffer.compare(Buffer.from(value.id,'hex'),Buffer.from(valuedb.id))===0){
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
        value.id=value.id.toString('hex');
    });

    const body = {
        "intent":"CAPTURE",
        "purchase_units":[
            {
                //"reference_id": "PUHF",
                "description": "Some description",
                "custom_id": userIdCookie,
                "soft_descriptor": "Airsoft_Warrior Buy",
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
            return_url:`${process.env.SERVER_ROOT_URI}/api/orders/capture-order`,
            cancel_url:`${process.env.UI_ROOT_URI}/cancel`
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
    .then((response) => res.status(200).json({url: response.data.links[1].href}))
    }catch(error){
        console.log(`Failed to fetch order`);
        res.status(500).json({isSuccess:false,message:"Algo ha fallado, intentelo de nuevo"})
    }
}

const captureOrder = async (req, res) =>{
    const { token } = req.query;
    const products = [];
    let updates = [];
    let result;
    try {
        const captureOrder = await axios.post(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
                auth
            }
        );
        //###redirect to error page if the order not capture = error
        if(!captureOrder) return res.redirect(`${process.env.UI_ROOT_URI}/cancel`)

        const orderData = await axios.get(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${token}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth
            }
        );

        orderData.data.purchase_units[0].items.map(product => {
            updates.push(prisma.products.updateMany({
                where: {
                    id: Buffer.from(product.sku,'hex'),
                    AND:[
                        {stock: {
                            gte: parseInt(product.quantity)
                        }},
                        {stock: {
                            gt: 0
                        }}
                    ]
                },
                data:{
                    stock:{
                        decrement: parseInt(product.quantity)
                    }
                }
            }))
            products.push({id_products:Buffer.from(product.sku,'hex'),quantity:parseInt(product.quantity)})
        })
        
        await prisma.$transaction(async prisma =>{
            const order = await prisma.orders.create({
                data:{
                    id_user:Buffer.from(orderData.data.purchase_units[0].custom_id,'hex'),
                    total:orderData.data.purchase_units[0].amount.value
                }
            });
            products.forEach((value)=>{
                value["id_orders"] = order.id
            });

            await prisma.orders_products.createMany({
                data:products
            });
            
            await Promise.all(updates.map(async (e)=>{
                (result) = await e
                console.log(result.count)
                if(result.count===0){
                    throw 400
                }
            }));
            
        });
        //res.status(200).json(orderData.data)
        //### CLEAN COOKIE
        return res.redirect(`${process.env.UI_ROOT_URI}/payed`)
    } catch (error) {
        console.log(error)
        res.redirect(`${process.env.UI_ROOT_URI}/cancel`)
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
require("dotenv/config")
const axios = require("axios")

const auth = {username:process.env.PAYPAL_CLIENT_ID,password:process.env.PAYPAL_CLIENT_SECRET}

const createOrder = async (req, res) => {
    const {order} = req.body;
    console.log(order)
    const body = {
        "intent":"CAPTURE",
        "purchase_units":[order.purchase_units[0]],
        application_context: {
            brand_name: `Airsoft Warriors`,
            landing_page: `NO_PREFERENCE`,
            user_action:`PAY_NOW`,
            return_url:`${process.env.UI_ROOT_URI}/api/orders/capture-order`,
            cancel_url:`${process.env.UI_ROOT_URI}/api/orders/cancel-order`
        }
    }

    console.log(body)

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    
    try{
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
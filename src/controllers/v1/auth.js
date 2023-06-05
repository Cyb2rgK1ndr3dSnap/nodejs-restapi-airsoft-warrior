const querystring = require("querystring");
const axios = require("axios")
const jwt = require("jsonwebtoken");
const { prisma } = require('../../config/connection.js');
const uuidParse = require('uuid-parse');
require("dotenv/config");
const {
    uploads,
    deletes
} = require("../../utils/handleCloudinary.js");

const {
    encrypt,
    compare,
} = require("../../utils/handleEncrypt.js")

const{
    cookieCreate
} = require("../../utils/handleCookieUser.js");

const{
    tokenSign,
    verifyToken
} = require("../../utils/handleGenerateToken.js")

const getGoogleAuthURL = (req, res) =>{
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env.SERVER_ROOT_URI}/api/auth/google`,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
  
    //return `${rootUrl}?${querystring.stringify(options)}`;
    res.status(200).json({"url":`${rootUrl}?${querystring.stringify(options)}`})
}

const getTokens = async ({ code, clientId, clientSecret, redirectUri }) => {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token"
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    }
    return await axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => res.data)
      .catch(error => {
        console.error(`Failed to fetch auth tokens`)
        throw new Error(error.message)
      })
}
//const setCookie = async (req, res)
const loginUserGoogle = async (req, res) => {
    const code = req.query.code;
    let result = "";
    const { id_token, access_token } = await getTokens({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.SERVER_ROOT_URI}/api/auth/google`,
    });
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });

      try {
        let user = await prisma.users.findUnique({
            where:{
                email:googleUser.email
            },
            select:{
                id:true,
                id_google:true,
                image_url:true,
                name:true,
                email:true,
            }
        })
        
        if(user && !user.id_google){
            return res.status(500).json({isSuccess:false,message:"Email no disponible"})
        }

        if(!user){
            image_url = {
                id:"googlePicture",
                url:googleUser.picture
            }
            user = await prisma.users.create({
                data:{
                    id_google:googleUser.id,
                    image_url,
                    name:googleUser.name,
                    email:googleUser.email,
                },
            })
        }
        const uuid = uuidParse.unparse(user.id)
        user.id = uuid

        token = await tokenSign(user)
        cookieCreate(req,res,process.env.COOKIE_NAME,token,3600000)

        return res.redirect(`${process.env.UI_ROOT_URI}`);
      } catch (error) {
        console.log(error)
        res.status(500).json(error)
      }
}

const createUser = async (req,res) =>{
    const {email,name,age,password,cpassword} = req.body
    let image_url;
    if(!(password===cpassword)) 
        return res.status(500).json({isSuccess:false,message:"Las constraseña no coinciden"})

    try {

        const user = await prisma.users.findUnique({
            where:{
                email:email
            }
        })

        if(user)
            return res.status(500).json({isSuccess:false,message:"Email no disponible"})

        if(req.file){
            const path = req.file.path;
            image_url = await uploads(path,"users");
        }else{
            image_url = {
                id:"users/defaultuser_wn4ieo",
                url:"https://res.cloudinary.com/dgfhyw8un/image/upload/v1684645346/users/defaultuser_wn4ieo.png"
            }
        }

        const passencrypt = await encrypt(password)

        if(image_url.url){
            const result = await prisma.users.create({
                data:{
                    image_url,
                    name,
                    age:parseInt(age),
                    email,
                    password:passencrypt
                }
            })

            if(!result) 
                res.status(500).json({isSuccess:false,message:"Error al crear cuenta"})

        }else{
            return res.status(500).json({
                isSuccess: false,
                message:"Error al cargar imagen"
            });
        }

        return res.status(200).json({isSuccess: true,message:"Cuenta creada exitosamente"})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await prisma.users.findUnique({
            where:{
                email:email
            },select:{
                id:true,
                image_url:true,
                name:true,
                phonenumber:true,
                email:true,
                password:true,
                id_google:true
            }
        })
        
        if(!user || user.id_google) return res.status(500).json({
            isSuccess:false,
            message:"Email o contraseña, invalidos"
        })

        const checkPassword = await compare(password,user.password)

        if(checkPassword===true){
            delete user.password
            const uuid = uuidParse.unparse(user.id)
            user.id = uuid
            const token = await tokenSign(user)
            cookieCreate(req,res,process.env.COOKIE_NAME,token,3600000)
            return res.redirect(`${process.env.UI_ROOT_URI}`);
        }
        return res.status(500).json({isSuccess:false,message:"Email o contraseña incorrectos"})
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error, comuniquese con soporte técnico"})
    }
}
//COMPROBAR LA IMAGEN SI EXISTE Y NO ES LA DE POR DEFECTO Y ELIMINARLA
const updateUser = async (req,res) => {
    try {
        let image_url = {};
        let response = ""
        const {name,lastname,age,phonenumber,password,newpassword,cnewpassword} = req.body
        const userIdCookie = req.userIdCookie
        const bytes = uuidParse.parse(userIdCookie)
        if(password){
            if(newpassword != cnewpassword) return res.status(400).json({
                isSuccess:false,
                message:"Nueva contraseña no coincidé"
            })
            const user = await prisma.users.findUnique({
                where:{
                    id:Buffer.from(bytes)
                },
                select:{
                    password:true,
                    id_google:true,
                    image_url:true
                }
            })

            if(user.id_google) return res.status(400).json({
                isSuccess:false,
                message:"No puede realizar esa acción"
            })

            const checkPassword = await compare(password,user.password)
            if(checkPassword == false) return res.status(400).json({
                isSuccess:false,
                message:"Contraseña incorrecta"
            })
        }

        if(req.file){
            const path = req.file.path;

            image_url = await uploads(path,"users");
                if(!image_url){
                    return res.status(500).json({isSuccess:false,message:"Error al cargar imagen"})
                }
            if(user.image_url.id != "users/defaultuser_wn4ieo"){
                response = await deletes()
            }
        }

        if(req.file===undefined || response.response === "ok" || response.response === "not found"){
            const result = await prisma.users.update({
                where:{
                    email:email  
                },
                data:{
                    name: name || undefined,
                    lastname: lastname || undefined,
                    age: parseInt(age) || undefined,
                    phonenumber: phonenumber || undefined,
                    password: newpassword || undefined,
                    image_url: image_url || undefined
                }
            });
            if (result) return res.status(204).json()
        }

        return res.status(500).json({
            isSuccess:false,
            message:"Error al actualizar información"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Error al actualizar usuario, comuniquese con soporte técnico"})
    }
}

const getProfile = async (req, res) => {
    try {
        const userIdCookie = req.userIdCookie
        const bytes = uuidParse.parse(userIdCookie)
        const result = prisma.users.findUnique({
            where:{
                id:Buffer.from(bytes)
            },
            select:{
                id:true,
                image_url:true,
                id_google:true,
                name:true,
                lastname:true,
                email:true
            }
        })
        if(result) return res.status(200).json(result)

        return res.status(500).json({
            isSuccess:false,
            message:"Error al obtener Perfil de usuario, contacté con soporté técnico"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getCookie = async (req, res) => {
    try {
      const decoded = await verifyToken(req.cookies[process.env.COOKIE_NAME].token);
      return res.status(200).json({token:req.cookies[process.env.COOKIE_NAME].token,id:decoded.id})
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
}

const deleteCookie = (req,res) =>{
    try{
        cookieCreate(req,res,process.env.COOKIE_NAME,"",0)
        res.redirect(`${process.env.UI_ROOT_URI}`);
    }catch (error){
        console.log(error)
        res.status(500).json(error)
    }
}



module.exports = {
    getGoogleAuthURL,
    loginUserGoogle,
    getCookie,
    deleteCookie,
    createUser,
    updateUser,
    loginUser,
    getProfile
}
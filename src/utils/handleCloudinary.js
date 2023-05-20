const dotenv = require("dotenv/config");
const cloudinary = require("cloudinary");

/** 
 * Asignación de las variables de entorno para la api de Cloudinary
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * retorna id y url de las imagenes insertadas, folder es dónde se asignará
 * @param {*} file 
 * @param {*} folder 
 * @returns 
 */
const uploads = (file, folder) => {   
    try{
        return new Promise(resolve => {
            cloudinary.uploader.upload(file, (result) => {
                resolve({
                    url: result.url,
                    id: result.public_id
                })
            },{
                resource_type: "auto",
                folder: folder
            })
        })
    }catch(e){
        console.log(e)
    }
}

/**
 * id del archivo que tiene en cloudinary para eliminarlo
 * @param {*} file 
 * @returns 
 */
const deletes = (file) =>{
    return new Promise(resolve => {
        cloudinary.uploader.destroy(file, (result) => {
            resolve({
                response: result.result,
            })
        })
    })
}

module.exports = {
    uploads,
    deletes
};
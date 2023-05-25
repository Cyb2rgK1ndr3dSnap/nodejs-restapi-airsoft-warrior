const multer = require("multer");
const path = require("path");


const multerStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, `${__dirname}/../uploads`);
  },
  filename: (request, file, callback) => {
    const ext = file.originalname.split('.').pop()
    const filename = `file-${Date.now()}.${ext}`
    callback(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/jpg'){
        cb(null,true)
    }else{
        cb({message: 'Unsupported file format'},false)
    }
}

multerUpload = multer({ 
    storage: multer.diskStorage({}),
    limits:{ fileSize: 1024 * 1024 * 2},
    fileFilter: fileFilter
});

module.exports = multerUpload;
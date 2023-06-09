const express = require('express');
const morgan = require("morgan");
const cors = require("cors")
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const {doubleCsrf} = require("csrf-csrf")
///##CONFIGURAR EL TOKEN DE doubleCsrf para poder habilitarlo
/*const {
  generateToken,
  doubleCsrfProtection
} = doubleCsrf("doubleCsrfOptions")*/
require("dotenv/config")

const PORT = process.env.PORT;

const app = express();

//app.use(helmet({ crossOriginResourcePolic: false}));
//app.use(helmet.crossOriginResourcePolicy({ policy : 'cross-origin'}))
app.use(helmet())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(doubleCsrfProtection)
app.use(cookieParser());

app.use(morgan("dev"));

const whitelist = process.env.CORS_ORIGINS.split(' ');

app.use(cors({
    origin:function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));

app.use(`/api`,require("./src/routes/v1"));

app.use((req,res,next)=>{
    res.status(404).json({
        message:"Not found"
    })
});

app.listen(PORT);
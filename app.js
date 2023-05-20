const express = require('express');
const morgan = require("morgan");
const dotenv = require("dotenv/config")
const cors = require("cors")
const cookieParser = require('cookie-parser');
//const { PrismaClient } = require('@prisma/client');
//const router = require("./src/routes/v1/products")

const PORT = process.env.PORT;

const app = express();
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin:`${process.env.SERVER_ROOT_URI}`,
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}))
app.use(`/api`,require("./src/routes/v1"))

app.use((req,res,next)=>{
    res.status(404).json({
        message:"Not found"
    })
})

app.listen(PORT);
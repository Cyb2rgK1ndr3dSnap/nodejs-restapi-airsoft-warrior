const express = require('express');
const morgan = require("morgan");
const dotenv = require("dotenv/config")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer();
//const { PrismaClient } = require('@prisma/client');

const PORT = process.env.PORT;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(upload.array())

app.use(cookieParser());

app.use(morgan("dev"))

app.use(cors({
    origin:`*`,
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
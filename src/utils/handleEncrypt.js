const bcrypt = require("bcryptjs");
require("dotenv/config")

const encrypt = async (textPlain) => {
    return hash = await bcrypt.hash(textPlain, process.env.HASH_SECRET);
};

const compare = async (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword);
};

module.exports = { 
    encrypt, 
    compare 
};
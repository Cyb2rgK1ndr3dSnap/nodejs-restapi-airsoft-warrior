const bcrypt = require("bcryptjs");

const encrypt = async (textPlain) => {
    return hash = await bcrypt.hash(textPlain, 8);
};

const compare = async (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword);
};

module.exports = { 
    encrypt, 
    compare 
};
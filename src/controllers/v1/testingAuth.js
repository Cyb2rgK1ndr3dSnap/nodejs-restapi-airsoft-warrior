const googleSignup = async (req, res, next) => {
    res.status(200).send(req.user);
    //res.status(200).json({salio:"ahhhhhhhhhhhhhhhhhh"});
    return next();
};

module.exports = {googleSignup}
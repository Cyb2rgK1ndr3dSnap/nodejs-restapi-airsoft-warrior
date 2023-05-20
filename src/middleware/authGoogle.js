const dotenv = require("dotenv/config")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const GooglePlusTokenStrategy = require("passport-google-plus-token")
const { prisma } = require("../config/connection");

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID, // Your client id
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your client secret
};

const googleStrategy = new GooglePlusTokenStrategy(
    googleConfig,
    async (accessToken, refreshToken, profile, done) => {
        try {
                /*const user = await prisma.users.findUnique ({
                    where:{
                        id:profile.id
                    }
                });

                if (!user) {
                    const newUser = await prisma.users.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                    });

                    return done(null, newUser);
                }
            return done(null, user);*/
            const user = {
                id:profile.id,
                name:profile.name,
                email:profile.emails[0].value,
                image:profile.photos[0].value
            }
            console.log(profile)
            return done(null, user)
        } catch (e) {
            return done(e, false);
        }
    }
);

passport.serializeUser((user, done) => {
    done(null, user)
  })

  // used to deserialize the user
  passport.deserializeUser((user, done) => {
    done(null, user)
  })


passport.use(googleStrategy);

const authGoogle = passport.authenticate("google-plus-token");

module.exports = {authGoogle}
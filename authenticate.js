const passport = require('passport');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const FacebookTokenStrategy = require('passport-facebook-token');
const ExtractJwt=require('passport-jwt').ExtractJwt
const jwt=require('jsonwebtoken')

const config = require('./config');

exports.local= passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=(user)=>{
    jwt.sign(user,config.secretKey,{
        expiresIn:3600
    });
}

const opts={}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport= passport.use(new JwtStrategy(opts,
   (jwt_payload,done)=>{
        console.log('JWT payload:',jwt_payload)
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){return done(err,false);}
            else if(user){
                return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
    }))

exports.verifyUser=passport.authenticate('jwt',{session:false});

exports.verifyAdmin=(req,res,next)=>{
    try {
        passport.authenticate('jwt',{session:false});
        if(req.user.admin){
            let admin = User.findById(req.user.admin._id)
            return res.status(200).send({ok:"true",data:admin})
        }    
    } catch (err) {
        res.status(403).send({ok:false,msj:"You are not authorized to perform this operation!"})
        next(err)
    }
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));

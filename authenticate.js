const passport = require('passport');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
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

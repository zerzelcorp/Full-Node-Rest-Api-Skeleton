const {Router} = require('express')
const User= require('../models/User');
const passport =require('passport');
const { authenticate } = require('passport');
const {getToken, verifyUser,verifyAdmin} = require('../authenticate');

const usersRouter = Router()

usersRouter.get('/',passport.authenticate('local'),verifyAdmin,async(req, res, next) => {
try {
  let users = await User.find({})
  res.status(200).send({ok:true,data:users})
} catch (err) {
  res.status(404).send({ok:false,msj:"there is no users!"})
  next(err)
}
});

usersRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
   const token = authenticate.getToken({_id: req.user._id});
    res.status(200).send({success: true, token: token, status: 'You are successfully logged in!'})
  }
});

 usersRouter.post('/signup',(req, res, next) => {
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.status(500).send({err: err})
      }
      else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.status(500).send({err:err})
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.status(200).send({success: true, status: 'Registration Successful!'})
          });
        });
      }
    });
  });

 usersRouter.post('/login',passport.authenticate('local'),(req, res) => {
    const token = getToken({_id:req.user._id})
    if(token){
      res.status(202).json({success: true, token:token,status: 'You are successfully logged in!'});
    }else{
      res.status(403).json({success:false,status: 'Invalid Data!'});
    }
  });

module.exports =usersRouter;
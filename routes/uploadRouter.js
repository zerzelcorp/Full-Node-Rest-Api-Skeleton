const {Router} =require('express')
const multer = require('multer')
const uploadRouter = Router()
const authenticate = require('../authenticate')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null, file.originalname)
    }
  })
  
  const imageFileFilter = (req, file, cb) => {
      if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('You can upload only image files!'), false);
      }
      cb(null, true);
  };

const upload = multer({ storage: storage,fileFilter: imageFileFilter})

uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
   res.status(403).send('GET operation not supported on /imageUpload')
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.status(200).send({data:req.file})
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.status(403).send('PUT operation not supported on /imageUpload')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.status(403).send('DELETE operation not supported on /imageUpload');
});

module.exports=uploadRouter
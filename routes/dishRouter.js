
const {Router} = require('express');
const DishSchema = require('../models/DishSchema');
const dishRouter = Router();

dishRouter.use((req,res,next) => {
    console.log('Requested URL:', req.originalUrl)

    // res.send('index',{ 
    //     title: 'Express' ,
    //     cookies:req.cookies,
    //     signedcookies:req.signedCookies
    // })
    next()
  })


dishRouter.get('/',async(req,res)=>{
    try {
   const dishes = await DishSchema.find({})         
  res.status(200).send({res:dishes,ok:true})       
} catch (error) {
res.status(404).send({status:"error",message:`${error}`})
}
})

dishRouter.get("/:id",async(req,res)=>{
const {id}= req.params
    try {
    const dish = await DishSchema.findById(id)  

        res.status(200).send({status:"ok",res:dish})  
    
} catch (error) {
    res.status(404).send({status:"error",message:`${error}`})
}
})

dishRouter.route("/")
.post(async(req,res) => {
    const {name,image,category,label,price,comments,description,featured} = req.body;
try {  
   let dish = DishSchema.findOne({name})
   if(dish){
       return res.status(400).send({status:"error",msj:"already a post with this title"})
   }
    const newDish = new DishSchema(req.body)
    await newDish.save()
    res.status(201).send({status:"ok",message:`post created${newDish}`}) 
} catch (error) {
   res.status(409).send({status:"error","message":`${error}`})  
}})
.put(async(req,res) => {
    const {id} = req.params
    try {
        await Leader.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).send({status:"ok",message:`post with id:${id} has been updated`})        
    } catch (error) {
        res.status(404).send({status:"error",message:`${error}`})  
    }
})
.delete(async(req,res) => {
    const {id}=req.params
    try {
        await Leader.deleteOne({id})
        res.status(200).send({status:`ok`,message:`task with id:${id} has been deleted`})
    } catch (error) {
        res.status(404).send({"message":`${error}`})
    }
});
module.exports = dishRouter

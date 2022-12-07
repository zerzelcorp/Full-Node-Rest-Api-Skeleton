const {Router} = require('express')
const Promo= require('../models/PromoSchema');
const {verifyAdmin,verifyUser}= require('../authenticate')

const promoRouter = Router()

promoRouter.get("/promotions",async(req,res)=>{
    try {
        const promo = await Promo.find({}) 
        res.status(200).send({res:promo?promo.name:"error",desc:"brr"})     
        }catch (error) {
            res.status(404).send({status:"error",message:`${error}`})
        }
})

promoRouter.get('/promotions/:id',async(req,res)=>{
    const {id}= req.params
    try {
        const promo = await Promo.findById(id)  
        res.status(200).send({res:promo})        
        } catch (error) {
            res.status(404).send({message:`${error}`})
        }
})

promoRouter.post('/promotions',verifyAdmin,async(req,res)=>{
    try {  
        let promo = Promo.findOne(req.body.name)
        // if(promo){
        //     return res.status(400).send({status:"error",msj:"already a promo with this name"})
        // }
         const newPromo = new Promo(req.body)
         await newPromo.save()
         res.status(201).send({status:"ok",message:`promo created${newPromo}`}) 
    } catch (error) {
        res.status(409).send({status:"error","message":`${error}`})  
}
})

promoRouter.put('/promotions/:id',verifyAdmin,async(req,res)=>{
    const {id} = req.params
    try {
        await Promo.findByIdAndUpdate(id,req.body)
        res.status(200).send({status:"ok",message:`post with id:${id} has been updated`})        
    } catch (error) {
        res.status(404).send({status:"error",message:`${error}`})  
    }
})

promoRouter.delete('/promotions/:id',verifyAdmin,async(req,res) => {
        const {id}=req.params
        try {
            await Promo.deleteOne({id})
            res.status(200).send({status:`ok`,message:`task with id:${id} has been deleted`})
        } catch (error) {
            res.status(404).send({"message":`${error}`})
        }
    });

module.exports = promoRouter;
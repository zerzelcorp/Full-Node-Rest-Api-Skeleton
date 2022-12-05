const express = require('express')
const Promo= require('../models/PromoSchema');

const promoRouter = express.Router()

promoRouter.route("/")
    .all(async(req, res, next) => {
        try {
            const promo=await Promo.find({})         
            res.status(200).send({res:promo})       
            } catch (error) {
                res.status(404).send({message:`${error}`})
            }
    })
    .get(async(req,res) => {
        const {id}= req.params
        try {
            const promo = await Promo.findById(id)  
            res.status(200).send({res:promo})        
            } catch (error) {
                res.status(404).send({message:`${error}`})
            }
    })
    .post(async(req,res) => {
        const {name,image,label,price,description,featured} = req.body;

   try {  
       let promo = Promo.findOne({title})

       if(promo){
           return res.status(400).send({status:"error",msj:"already a post with this title"})
       }

        const newPromo = new Promo(req.body)

        await newPromo.save()

        res.status(201).send({status:"ok",message:`post created${newPromo}`}) 
   } catch (error) {
       res.status(409).send({status:"error","message":`${error}`})  
    })
    .put(async(req, res, next) => {
        const {id} = req.params
        try {
            await Promo.findByIdAndUpdate(id,req.body)
            res.status(200).send({status:"ok",message:`post with id:${id} has been updated`})        
        } catch (error) {
            res.status(404).send({status:"error",message:`${error}`})  
        }
    })
    .deleteasync(async(req,res) => {
        const {id}=req.params
        try {
            await Promo.deleteOne({id})
            res.status(200).send({status:`ok`,message:`task with id:${id} has been deleted`})
        } catch (error) {
            res.status(404).send({"message":`${error}`})
        }
    });
module.exports = promoRouter
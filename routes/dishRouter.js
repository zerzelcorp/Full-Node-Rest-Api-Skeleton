
const express = require('express');
const DishSchema = require('../models/DishSchema').default;
const dishRouter = express.Router()

dishRouter.route("/")
.all(async(req,res) => {
    try {
        const dish = await DishSchema.find({})         
        res.status(200).send({res:dish})       
        } catch (error) {
            res.status(404).send({message:`${error}`})
        }
})
.get(async(req,res) => {
    const {id}= req.params
    try {
        const dish = await DishSchema.findById(id)  
        res.status(200).send({res:dish})        
        } catch (error) {
            res.status(404).send({message:`${error}`})
        }
})
.post(async(req,res) => {
    const {name,image,category,label,price,comments,description,featured} = req.body;
try {  
   let dish = DishSchema.findOne({title})
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
        await Leader.findByIdAndUpdate(id,req.body)
        res.status(200).send({status:"ok",message:`post with id:${id} has been updated`})        
    } catch (error) {
        res.status(404).send({status:"error",message:`${error}`})  
    }
})
.deleteasync(async(req,res) => {
    const {id}=req.params
    try {
        await Leader.deleteOne({id})
        res.status(200).send({status:`ok`,message:`task with id:${id} has been deleted`})
    } catch (error) {
        res.status(404).send({"message":`${error}`})
    }
    });
module.exports = dishRouter

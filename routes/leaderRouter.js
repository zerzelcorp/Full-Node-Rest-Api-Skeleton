const express = require('express');
const LeaderSchema = require('../models/LeaderSchema');

const leaderRouter = express.Router()

leaderRouter.route("/")
.all(async(req,res) => {
    try {
        const leader = await LeaderSchema.find({})         
        res.status(200).send({res:leader})       
        } catch (error) {
            res.status(404).send({message:`${error}`})
        }
})
.get(async(req,res) => {
    const {id}= req.params
    try {
        const leader = await LeaderSchema.findById(id)  
        res.status(200).send({res:leader})        
        } catch (error) {
            res.status(404).send({message:`${error}`})
        }
})
.post(async(req,res) => {
    const {name,image,designation,abbr,description,featured} = req.body;
try {  
   let leader = LeaderSchema.findOne({title})
   if(leader){
       return res.status(400).send({status:"error",msj:"already a post with this title"})
   }
    const newLeader = new Promo(req.body)
    await newLeader.save()
    res.status(201).send({status:"ok",message:`post created${newLeader}`}) 
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

module.exports = leaderRouter
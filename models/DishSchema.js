const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    comment:{type:String,required:true,unique:true},
    rating:{type:String,min:1,max:5},
    author:{type:String,requried:true},
    date: { type: Date, default: Date.now },
})

const DishSchema = new Schema({
    name:{type:String,required:true,unique:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
    label:{type:String,default:""},
    price:{type:Number,required:true},
    featured:{type:Boolean,default:false},
    description:{type:String,required:true},
    comments:[CommentSchema],//rating,comment,author,date
    date: { type: Date, default: Date.now },
})

module.exports= model("Dish",DishSchema);
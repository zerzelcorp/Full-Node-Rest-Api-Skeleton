import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
    comment:{type:String,required:true,unique:true},
    rating:{type:String,min:1,max:5},
    author:{type:String,requried:true},
    date: { type: Date, default: Date.now },
})
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const DishSchema = new Schema({
    name:{type:String,required:true,unique:true},
    image:String,
    category:String,
    label:{type:String,default:""},
    price:Currency,
    featured:Boolean,
    description:{type:String,required:true},
    comments:[CommentSchema],//rating,comment,author,date
    date: { type: Date, default: Date.now },
})

export default model("Dish",DishSchema);
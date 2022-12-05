const {Schema,model} = require('mongoose')

const PromoSchema = new Schema({
    name:{type:String,required:true,unique:true},
    image:{type:String},
    label:{type:String,default:""},
    price:Number,
    description:{type:String,required:true},
    featured:Boolean,
    date: { type: Date, default: Date.now },
})
// The price schema is be supported with a new SchemaType called Currency.
module.exports = model("Promo",PromoSchema);
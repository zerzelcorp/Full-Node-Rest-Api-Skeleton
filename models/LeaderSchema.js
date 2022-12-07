const {Schema,model} = require('mongoose')

const LeaderSchema = new Schema({
    name:{type:String,required:true,unique:true},
    image:String,
    designation:String,
    abbr:String,
    description:{type:String},
    featured:Boolean,
    date: { type: Date, default: Date.now },
})

module.exports = model("Leader",LeaderSchema);
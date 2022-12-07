const {Schema,model} = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const User=new Schema({
username:{type:String,default:''},
lastname:{type:String,default:''},
// password:{type:String,required:true},
admin:{type:Boolean,default:false}
})

User.plugin(passportLocalMongoose);

module.exports = model('User',User)

const mongoose= require('mongoose');
const config = require('./config')

mongoose.connect(config.mongoUrl,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log(`🍃 DB connected!`)
})
.catch(e=>console.log('db err',e))
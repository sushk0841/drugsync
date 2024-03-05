const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/drugsyncDB").then(()=>{
        console.log("MongoDB Connected")
     }).catch((e)=>{
        console.log("no connection to MongoDB")})

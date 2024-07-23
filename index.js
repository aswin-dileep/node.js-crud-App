const express = require('express');
const app = express()
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://aswindilip5:6NZO85hFB2VDPSqf@backenddb.levwpb9.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("Connected to the database")
    
}).catch((err)=>{
    console.log(err)
})

app.get('/',(req,res)=>{
    res.send("hello World!")
})

app.listen(3000,()=>{
    console.log("running in port 3000")
})
import express from "express";
import "dotenv/config"
import mongoose from "mongoose";

const app =express()
const port =process.env.Port;

 const server =async()=>{
    try {
    await mongoose.connect(process.env.MONGOURL)
    console.log("database is connected")
    app.listen(port,()=>{
        console.log("server is running on port 2004")
    })
    } catch (error) {
    console.log("database is not connected successfully")    
    }
}


import mongoose from "mongoose";
const joineeSchema= new mongoose.Schema({
    fullName:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:String,require:true},
    password:{type:String,require:true},
    location:{type:String,require:true},
    skills:[{type:String}],
    experience:{type:Number,require:true},
    // resume:{type:Number,require:true},
    otherUrl:{type:String},
    proiflePif:{type:String}

},{
    timestamps:true
})
const joinee=mongoose.model('joinee', joineeSchema)
export default joinee;
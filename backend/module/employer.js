import mongoose from "mongoose";
const employyeSchema=new mongoose.Schema({
    companyName:{type:String,require:true},
    companyEmail:{type:String,require:true},
    companyPhone:{type:String,require:true},
    companyPassword:{type:String,require:true},
    companyUrl:{type:String},
    companyLocation:{type:String,require:true},
    companyProfilePic:{type:String,require:true}
},{
    timestamps:true
})
const employer=mongoose.model('employer',employyeSchema)
export default employer
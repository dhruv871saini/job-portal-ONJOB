import bcrypt from "bcryptjs"
import { errorResponse, successResponse } from "../middleware/newResponse";
import admin from "../module/admin";
import { generateAccessToken, generateRefreshToken } from "../middleware/generateToken";

export const adminRegister=async (req,res)=>{
    const {adminName,adminEmail,adminPhone,adminPassword, adminProfilePic}=req.body;
    try {
        if(!adminEmail || !adminName || !adminPhone || !adminPassword){
            return errorResponse(404,"all field are required ")
        }
        const verifyPhoneEmail = await admin.find({$or:[{adminPhone},{adminEmail}]})
        if(verifyPhoneEmail.length > 0){
            return errorResponse(404,"Phone number and Email is already exist")
        }
        const hashPassword=await bcrypt.hash(adminPassword,10);
        const newAdmin =new admin({
            adminEmail,
            adminPhone,
            adminPassword:hashPassword,
            adminName,
            adminProfilePic
        })

        await newAdmin.save();
         const payload={
            id:newAdmin._id
         }
         const token = generateAccessToken(payload)
         const refreshToken = generateRefreshToken(payload)
         res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            SameSite:"Strict",
            maxAge:15*24*60*60*1000
         })
         return successResponse(201,"Successfully Register",{accessToken:token})
    } catch (error) {
        return errorResponse(500,"interal server ",error)
    }
}

export const adminLogin=async(req,res)=>{
    
}
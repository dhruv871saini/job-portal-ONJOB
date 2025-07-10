import bcrypt from "bcryptjs"
import successResponse from "../middleware/successResponse"
import joinee from "../module/joinee";
import jwt from "jsonwebtoken"
export const joinneeRegister=async(req,res)=>{
    const {phone,password,confirmPassword,fullName,email, location,experience,Url,profilePic,skills}=req.body

    try {
        const verifyPhone =await joinee.find({phone})
        if (verifyPhone){
            return successResponse(404,"Phone number is already exist")
        }
        if(!phone||!password||!confirmPassword||!fullName||!email||!location||!experience||!skills){
            return successResponse(404,"fill the required field",0);
        }
        if(password!=confirmPassword){
            return successResponse(404,"password doesn't match ",0)
        }

        const hashPassword =await bcrypt.hash(10,password)
        const joiny =new joinee({
            fullName,
            phone,
            email,
            location,
            experience,
            password:hashPassword,
            skills,
            Url,
            profilePic
        })
        joiny.save()
        const token = jwt.sign({id:joinee._id},process.env.SECRETKEY,{expiresIn:"5d"})
        return successResponse(201,"successfully Register",token)
    } catch (error) {
        return successResponse(500 ,"server error ", error)
    }
}

export const joineeLogin=async(req,res)=>{
    const {phone, password}=req.body;
    try {
        
        if(!phone||!password){
            return successResponse(404,"ALL   ")
        }
        const user=await joinee.find({phone})
        if(!user){
            return successResponse(404,"Phone number don't extist ")
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return successResponse(404,"Wrong Password")
        }
         const token =jwt.sign({id:user._id},process.env.SECRETKEY,{expiresIn:"5d"})

         return successResponse(200,"Login Successfully",token)

    } catch (error) {
        return successResponse(500,"server error ",error)        
    }
}

 export const joineeUpdate=async(req,res)=>{
    const {id}=req.params;
    try {
        if(id){
            return successResponse(404,"ID not provided ")
        }
        const verify= await joinee.findByIdAndUpdate({_id:id},req.body,{new:true})
        if(verify){
            return successResponse(200,"Update Successfully")
        }
        return successResponse(404,"Event not provide !")
    } catch (error) {
        return successResponse(500,'server error ',error)
    }
}
export const joineeDelete=async(req,res)=>{
    const {id}=req.params
    try {
        if(id){
            return successResponse(404,"ID not provided !")
        }
        const verify=await joinee.findByIdAndDelete({_id:id})
        if(verify){
            return successResponse(200,"Delete Successfully",verify)
        }
        return successResponse(404,'Failed Deletion !')
    } catch (error) {
        return successResponse(500,'server error ',error)
    }
}






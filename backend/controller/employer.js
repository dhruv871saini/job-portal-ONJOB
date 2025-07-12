import bcrypt from "bcryptjs";
import newResponse from "../middleware/successResponse";
import employer from "../module/employer";
import { jwt } from "jsonwebtoken";

export const employerRegister = async (req, res) => {
  const {
    companyName,
    companyEmail,
    companyPhone,
    companyPassword,
    companyUrl,
    companyLocation,
    companyProfilePic,
    companyConfirmPassword,
  } = req.body;
  try {
    const verification = await employer.find({
      $or: [{ companyEmail }, { companyName }],
    });
    if (verification) {
      return newResponse(400, "Email and Name is occupied already");
    }
    if (
      !companyEmail ||
      !companyLocation ||
      !companyName ||
      !companyPassword ||
      !companyPhone
    ) {
      return newResponse(404, "fill the required field");
    }
    if (companyConfirmPassword != companyPassword) {
      return newResponse(400, "Password are not match");
    }
    const hashPassword = await bcrypt.hash(10, companyPassword);
    const newEmplyer = new employer({
      companyEmail,
      companyLocation,
      companyName,
      companyPassword: hashPassword,
      companyPhone,
    });
    newEmplyer.save()
    
    const token= jwt.sign({id:newEmplyer._id},process.env.SECRET_KEY,{expire:"5d"})
    return newResponse(201,"Register Successfully",token)
  } catch (error) {
    return newResponse(500,"server error ",error)
  }
};

export const employerLogin =async (req,res)=>{
  const {identity,companyPassword}=req.body
  try {
    if(!identity||!companyPassword){
    return newResponse(400,"Fill all required filled")
  }
   
  const existingUser=await employer.find({
    $or:[{companyEmail:identity},{companyPhone:identity}]
  })

  if(!existingUser){
    return newResponse(404,"User doesn't found")
  }
  const matchPassword= await bcrypt.compare(companyPassword,existingUser.companyPassword)
  if(!matchPassword){
    return newResponse(400,"Wrong password")
  }
  const token = jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'5d'})
  return newResponse(200," User Login Successfully",token)
  } catch (error) {
    return newResponse(500,"server error ",error)
  }
}

export const employerUpdate=async(req,res)=>{
 const {id}=req.body
 try {
  if(id){
    return newResponse(400,"User Id not found")
  }
  const verifyUser=await employer.findByIdAndUpdate({_id:id},req.body,{new:true})
  if(!verifyUser){
    return newResponse(404,"User not update")
  }
  return newResponse(200,"User Update successfully")

 } catch (error) {
  return newResponse(500,"Server Error ",error)
 } 

}

export const employeeDelete=async(req,res)=>{
  const {id}=req.body;
  try {
    if(id){
      return newResponse(400,"User Id not found")
    }
    const verifyUser=await employer.findByIdAndDelete({_id:id})
    if(!verifyUser){
      return newResponse(400,"User not Delete")
    }
    return newResponse(200,"User Delete Successfully")
  } catch (error) {
    return newResponse(500,"server error ",error)
  }
}
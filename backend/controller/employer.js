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
    return newResponse(201,"register successfully",token)
  } catch (error) {
    return newResponse(500,"server error ",error)
  }
};

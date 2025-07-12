import  jwt from "jsonwebtoken";
import newResponse from "./successResponse";

 const refreshTokenMiddleware=async(req ,res,next)=>{
    const token=req.cookies.refreshToken;
    if(!token){
        return newResponse(400,"NO refresh token")
    }
    const decode= jwt.verify(token,process.env.REFRESH_SECRET_KEY)
}
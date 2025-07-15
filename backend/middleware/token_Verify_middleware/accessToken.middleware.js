import jwt  from "jsonwebtoken"
import employer from "../../module/employer"
import { errorResponse } from "../newResponse"

const accessTokenMiddleware= async (req ,res ,next)=>{
    const authHeader =req.headers.authorization
    try {
        if (!authHeader){
        return errorResponse(401,"Unauthorized : token missing")
    }
    const token =authHeader.split(" ")[1]
    const decode = jwt.verify(token,process.env.SECRET_KEY)
    const user = await employer.findById(decode.id).select("comapanyPassword") 
    if(!user){
        return errorResponse(401,"Unauthorized user not found")
        // this is used for if admin delete the employer it not login with token 
        // because  it user not found in database so it break the middleware 
    }
    req.user=user;
    next()
    } catch (error) {
        return errorResponse(500,"server error with middlware",error)
    }
}
export default accessTokenMiddleware;
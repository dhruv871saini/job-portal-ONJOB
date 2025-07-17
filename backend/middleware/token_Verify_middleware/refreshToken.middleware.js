import jwt from "jsonwebtoken";
import employer from "../../module/employer";
import { generateAccessToken } from "../generateToken";
import { errorResponse, successResponse } from "../newResponse";

const refreshTokenMiddleware = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    try {
        if (!token) {
            return errorResponse(401, "NO refresh token")
        }
        const decode = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
        const user = await employer.findById(decode.id)
        if (!user || user.refreshToken != token) {
            return errorResponse(403, "Invalid refresh token")
        }
        const accesstoken = generateAccessToken({ id: user._id })
        return successResponse(200, "Refresh the token", accesstoken)
    } catch (error) {
        return errorResponse(403,"Invalid or expired refresh token ",error)
    }
}
export default refreshTokenMiddleware;
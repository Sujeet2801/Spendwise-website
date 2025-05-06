import jwt, { decode } from "jsonwebtoken"
import { ApiError } from "../utils/api-error.js"

export const isAuthenticated = async(req, res, next) => {

    const token = req.cookies?.token
    console.log(token);
    
    if(!token){
        throw new ApiError(401, "Not authenticated")
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        req.user = { id: decoded._id }
        console.log(decoded._id);
        
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or Expired token")
    }
}
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Token } from "../../DB/models/token.js";
import { User } from "../../DB/models/user.js";


export const isAuthenicated = asyncHandler(async (req,res,next)=>{
    //check token existence
    let token = req.headers["token"]
    //check bearer key
    if(!token )
        return next(new Error("valid token is required"))
    //extract payload
    const payload = jwt.verify(token , process.env.TOKEN_SECRET)
    //check token in db
    const tokenDB = await Token.findOne({token , isValid : true})
    if(!tokenDB) return next(new Error("invalid token"))
    //check user existance
    const user = await User.findById(payload._id)
    if(!user) return next(new Error("user not found" ,{cause : 404}))
    //pass user
    req.user = user
    //next
    return next();
})
import  jwt  from 'jsonwebtoken';
import { User } from '../../../DB/models/user.js';
import { Token } from '../../../DB/models/token.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import bcryptjs from "bcryptjs" 



// add user
export const addUser = asyncHandler(async(req , res , next)=>{
    //data from request 
    const {email  , password} = req.body;

    //check user existence
    const user = await User.findOne({email})
    if(user){
        return next(new Error("this email already exist" , {cause : 409}))
    }

    //hash password 
    const hashPassword = bcryptjs.hashSync(password , 8)
    

    //craete user 
    await User.create({...req.body , password:hashPassword})


    //send response 
    return res.status(201).json({success : true , message : "user added successfully" , name : req.body.name})
    

})


//login 
export const login = asyncHandler(async (req,res,next)=>{
    //data from request
    const {email , password} = req.body
    //check user existance
    const user = await User.findOne({email})
    if(!user ) return next(new Error("invalid email or password "))
    //check password
    const match = bcryptjs.compareSync(password , user.password , process.env.TOKEN_SECRET)
    if( !match) return next(new Error("invalid email or password "))
    //generate token 
    const token = jwt.sign({email , id : user.id_by_organization , _id : user._id } , process.env.TOKEN_SECRET)
    //save token in token model
    await Token.create({token , user :user._id})
    //send response
    return res.json({success : true , results :{token}})
})





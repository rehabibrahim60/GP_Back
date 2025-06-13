import  jwt  from 'jsonwebtoken';
import { User } from '../../../DB/models/user.js';
import { Token } from '../../../DB/models/token.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import bcryptjs from "bcryptjs"
import { logActivity } from '../../utils/logActivity.js';



// add user
export const addUser = asyncHandler(async(req , res , next)=>{
    //data from request 
    const {email  , password} = req.body;

    //check user existence
    const userExist = await User.findOne({
        $or: [
            { email: req.body.email},
            { id_by_organization: req.body.id_by_organization }
            ]
        })
    if(userExist){
        return next(new Error("this user already exist" , {cause : 409}))
    }

    //hash password 
    const hashPassword = bcryptjs.hashSync(password , 8)
    

    //craete user 
    const user = await User.create({...req.body , password:hashPassword})

    // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Add a new Quality mamber',
        entityType: 'User',
        entityId: user._id,
    });

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
    const token = jwt.sign({email ,  _id : user._id , role : user.role } , process.env.TOKEN_SECRET)
    //save token in token model
    await Token.create({token , user :user._id})
    //send response
    return res.json({success : true , results :{token , user:user.role}})
})

//delete user
export const deleteUser = asyncHandler(async (req , res , next) =>{
    //check user in database
    const user = await User.findById(req.params.id)
    if(!user) return next(new Error("user not found" , {cause: 404}))
    //make his token not valid
    await Token.updateMany({user : user._id},{isValid : false})
    //delete user from db
    await User.findByIdAndDelete(user._id)
        // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Delete Quality mamber',
        entityType: 'User',
        entityId: user._id,
    });
    //send response
    return res.json({success: true , message: "user deleted successfully"})
})

//update user
export const updateUser = asyncHandler(async (req , res , next) =>{
    //check user in database
    const user = await User.findById(req.params.id)
    if(!user) return next(new Error("user not found" , {cause: 404}))
    
    //update user
    user.name = req.body.name ? req.body.name : user.name
    user.id_by_organization = req.body.id_by_organization ? req.body.id_by_organization : user.id_by_organization
    user.phone = req.body.phone ? req.body.phone : user.phone
    user.email = req.body.email ? req.body.email : user.email
    user.password = req.body.password ? req.body.password : user.password
    //save user
    await user.save()
        // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Update Quality mamber info',
        entityType: 'User',
        entityId: user._id,
    });
    //send response
    return res.json({success: true , message: "user updated successfully" , user})
})


//find one user
export const getUser = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user) return next(new Error("User not found" , {cause: 404}))
    return res.json({success : true , user})
})

//get all users
export const allUsers = asyncHandler(async (req,res,next)=>{
    const users = await User.find({role : "quality_member"})
    return res.json({success : true , users})
})




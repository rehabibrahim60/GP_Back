import { Schema , model } from "mongoose";

const userSchema = new Schema({
    id_by_organization :{
        type : String , 
        required : true , 
        min : 6
    },
    name :{
        type : String ,
        required : true ,
        min : 3 ,
        max : 20
    },
    email :{
        type : String ,
        required : true,
        unique : true,
        lowercase : true
    },
    password :{
        type : String ,
        required : true
    },
    phone :{
        type : String , 
        required : true 
    },
    role: {
        type : String ,
        enum : ["admin" , "quality_member"],
        default : "quality_member"
    }

},{timestamps : true})

export const User = model("User" , userSchema)
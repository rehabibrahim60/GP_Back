import { model, Schema, Types } from "mongoose";

const flagSchema = new Schema({
    flag_type : {
        type : String , 
        required : true , 
        enum : ["red" , "yellow"]
    },
    reason :{
        type : String ,
        required : true 
    },// broken rule
    tutor_id :{
        type : Types.ObjectId , 
        ref : "Tutor",
        required : true , 
    },
    session_id :{
        type : Types.ObjectId , 
        ref : "Session",
        required : true , 
    }
},{timestamps : true})

export const Flag = model("Flag" , flagSchema)
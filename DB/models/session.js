import { model, Schema, Types } from "mongoose";

const sessionSchema = new Schema({
    zoomId : {
        type : String,
        // required : true
        // unique : true 
    },
    title :{
        type : String
    } ,
    tutor_id : {
        type : Types.ObjectId,
        ref : "Tutor",
        required : true,
    },
    pdf_id : {
        type : Types.ObjectId,
        ref : "Pdf",
        required : true,
    },
    video : {
        id : {type : String , required : true },
        url : {type : String , required : true }
    },
    assigned_to :{
        type :Types.ObjectId , 
        ref : "User",
        required : true 
    },// assigned to qm
    status :{
        type : String , 
        default : "not reviewed"
    }//(reviewed by qm or not)

},{timestamps : true})

export const Session = model("Session" , sessionSchema)
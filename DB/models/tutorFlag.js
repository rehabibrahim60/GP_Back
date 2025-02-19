import { model, Schema, Types } from "mongoose";

const sessionSchema = new Schema({
    session_id : {
        type : Types.ObjectId,
        ref : "Session",
        required : true,
    },
    flag_id : {
        type : Types.ObjectId,
        ref : "Flag",
        required : true,
    },
    comment : {
        type : String,
        required : true
    },
},{timestamps : true})

export const Session = model("Session" , sessionSchema)
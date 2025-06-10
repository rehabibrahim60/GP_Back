import { model, Schema, Types } from "mongoose";

const tutorFlagSchema = new Schema({
    session_id : {
        type : Types.ObjectId,
        ref : "Session",
        required : true,
    },
    flag_id : {
        type : Types.ObjectId,
        ref : "Flag",
    },
    comment : {
        type : String,
        required : true
    },
},{timestamps : true})

export const TutorFlag = model("TutorFlag" , tutorFlagSchema)
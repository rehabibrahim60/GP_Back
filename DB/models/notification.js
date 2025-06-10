import { model, Schema, Types } from "mongoose";

const notificationSchema = new Schema({
    user_id : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
    },
    message : {
        type : String,
        required : true
    },
    isRead : {
        type : Boolean,
        default : false,
    }
},{timestamps : true})

export const Notification = model("Notification" , notificationSchema)
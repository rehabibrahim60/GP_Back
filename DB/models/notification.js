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
},{timestamps : true})

export const Notification = model("Notification" , notificationSchema)
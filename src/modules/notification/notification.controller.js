import { asyncHandler } from "../../utils/asyncHandler.js";
import {Notification} from "../../../DB/models/notification.js"

//add notification
export const addNotification = asyncHandler(async (req,res,next)=>{
    
    //add notification in db
    const notification = await Notification.create({
        user_id : req.body.user_id,
        message : req.body.message,
    })
    //response
    return res.json({success : true , message : "notification added successfuly" , notification})
})

//get all notifications
export const allNotifications = asyncHandler(async (req,res,next)=>{
    const notifications = await Notification.find()
    return res.json({success : true , notifications})
})

//get unread notifications
export const unReadNotifications = asyncHandler(async (req,res,next)=>{
    const notifications = await Notification.find({isRead : false})
    return res.json({success : true , notifications})
})

//update notification
export const updateNotification = asyncHandler(async (req , res , next) =>{
    //check notification in database

    await Notification.updateMany(
        { user_id: req.params.id, isRead: false },
        { $set: { isRead: true } }
    );
    //send response
    return res.json({success: true , message: "notification updated successfully"})
})


//delete notification
export const deleteNotification = asyncHandler(async (req , res , next) =>{
    //check notification in database
    const notification = await Notification.findById(req.params.id)
    if(!notification) return next(new Error("notification not found" , {cause: 404}))
    await notification.findByIdAndDelete(notification._id)
    //send response
    return res.json({success: true , message: "notification deleted successfully"})
})


//find one notification
export const getNotification = asyncHandler(async (req,res,next)=>{
    const notification = await Notification.findById( req.params.id)
    if(!notification) return next(new Error("notification not found" , {cause: 404}))
    return res.json({success : true , notification})
})

//find  notification by user id
export const getNotificationByUser = asyncHandler(async (req,res,next)=>{
    const notifications = await Notification.find({user_id : req.params.id})
    // if(!notifications) return next(new Error("notifications not found" , {cause: 404}))
    return res.json({success : true , notifications})
})







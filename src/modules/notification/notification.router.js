import { Router } from "express";
import { validation } from "../../middelware/validation.middleware.js";
import * as notificationSchema from "./notification.schema.js";
import * as notificationController from "./notification.controller.js"
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";

const router = Router()

//add new notification 
router.post(
    '/',
    isAuthenicated,
    validation(notificationSchema.addNotification) ,
    notificationController.addNotification 
)

//get all notifications 
router.get(
    "/",
    isAuthenicated, 
    notificationController.allNotifications
)

//get one notification
router.get(
    "/:id",
    isAuthenicated,
    validation(notificationSchema.idSchema) , 
    notificationController.getNotification
)

//get notification by userID
router.get(
    "/user/:id",
    isAuthenicated,
    validation(notificationSchema.idSchema) , 
    notificationController.getNotificationByUser
)

//update notification 
router.patch(
    "/:id" ,
    isAuthenicated,
    validation(notificationSchema.updateNotification), 
    notificationController.updateNotification)

//delete notification 
router.delete(
    "/:id" ,
    isAuthenicated,
    validation(notificationSchema.idSchema), 
    notificationController.deleteNotification
)

export default router
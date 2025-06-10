import Joi from "joi";
import { isValidObjectId } from "../../middelware/validation.middleware.js";

//add new Notification schema
export const addNotification = Joi.object({
    user_id : Joi.string().custom(isValidObjectId).required(),
    message : Joi.string().required(),
}).required()



//Get one Notification
export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required()


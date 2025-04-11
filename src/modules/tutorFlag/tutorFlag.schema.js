import Joi from "joi";
import { isValidObjectId } from "../../middelware/validation.middleware.js";



export const createTutorFlag = Joi.object({
    session_id: Joi.string().custom(isValidObjectId).required(),
    flag_id: Joi.string().custom(isValidObjectId).required(),
    comment: Joi.string().min(3).max(500).required(),
});


//used in get tutor flag by id && delete tutor flag
export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});


export const updateTutorFlag = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    session_id: Joi.string().custom(isValidObjectId).required(),
    flag_id: Joi.string().custom(isValidObjectId).required(),
    comment: Joi.string().min(3).max(500).required(),
});

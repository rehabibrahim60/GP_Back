import Joi from "joi";
import { isValidObjectId } from "../../middelware/validation.middleware.js";

export const createFlag = Joi.object({
    flag_name: Joi.string().min(3).max(100).required(),
});

export const updateFlag = Joi.object({
    id : Joi.string().custom(isValidObjectId).required(),
    flag_name: Joi.string().min(3).max(100).required(),
})

export const deleteFlag = Joi.object({
    id : Joi.string().custom(isValidObjectId).required(),
})


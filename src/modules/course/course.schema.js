import Joi from "joi";
import { isValidObjectId } from "../../middelware/validation.middleware.js";

//add new Course schema
export const addCourse = Joi.object({
    title : Joi.string().required(),
    num_of_lessons : Joi.number().required(),
}).required()

//update Course
export const updateCourse = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    title : Joi.string(),
    num_of_lessons : Joi.number(),

}).required()

//Get one Course
export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required()


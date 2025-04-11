import Joi from "joi";
import mongoose from "mongoose";
import { isValidObjectId } from "../../middelware/validation.middleware.js";



export const createSession = Joi.object({
    title: Joi.string().optional(),
    tutor_id: Joi.string().custom(isValidObjectId).required(),
    // pdf_link: Joi.string().uri().required(),
    pdf_id : Joi.string().custom(isValidObjectId).required(),
    assigned_to: Joi.string().custom(isValidObjectId).required(),
    grade: Joi.string().optional(),
    lesson: Joi.string().optional(),
    date: Joi.date().required(),
    status: Joi.string().valid("pending",  "inProgress" ,"done").optional(),
}).required();

export const updateSession = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    tutor_id: Joi.string().custom(isValidObjectId).required(),
    assigned_to: Joi.string().custom(isValidObjectId).required(),
    title: Joi.string().optional(),
    pdf_id: Joi.string().custom(isValidObjectId).required(),
    grade: Joi.string().optional(),
    video:Joi.required(),
    lesson: Joi.string().optional(),
    date: Joi.date().optional(),
    status: Joi.string().valid("pending", "inprogress" ,"done").optional(),
});

//used in get session by id && delete session
export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required();


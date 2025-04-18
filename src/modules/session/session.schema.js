import Joi from "joi";
import mongoose from "mongoose";
import { isValidObjectId } from "../../middelware/validation.middleware.js";



export const createSession = Joi.object({
    title: Joi.string().allow(''),
    tutor_id: Joi.string().custom(isValidObjectId).required(),
    // pdf_link: Joi.string().uri().required(),
    pdf_id : Joi.string().custom(isValidObjectId).required(),
    assigned_to: Joi.string().custom(isValidObjectId).required(),
    grade: Joi.string().allow(''),
    lesson: Joi.string().allow(''),
    date: Joi.date().required(),
    status: Joi.string().valid("pending",  "inProgress" ,"done").optional(),
}).required();

export const updateSession = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    tutor_id: Joi.string().custom(isValidObjectId).required(),
    assigned_to: Joi.string().custom(isValidObjectId).required(),
    title: Joi.string().allow(''),
    pdf_id: Joi.string().custom(isValidObjectId).required(),
    grade: Joi.string().allow(''),
    video:Joi.required(),
    lesson: Joi.string().allow(''),
    date: Joi.date().required(),
    status: Joi.string().valid("pending", "inprogress" ,"done").optional(),
});

//used in get session by id && delete session
export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required();


import Joi from "joi";

// Add New PDF Schema
export const addPdf = Joi.object({
    pdfTitle : Joi.string(),
    course_id: Joi.string().required(),
    lesson_id: Joi.string().required(),
}).required();

// Update PDF Schema
export const updatePdf = Joi.object({
    id: Joi.string().required(),
    pdfTitle : Joi.string(),
    course_id: Joi.string(),
    lesson_id: Joi.string(),
}).required();

// Get One PDF Schema
export const idSchema = Joi.object({
    id: Joi.string().required(),
}).required();



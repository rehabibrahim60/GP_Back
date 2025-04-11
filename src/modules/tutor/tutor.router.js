import { Router } from "express";
import { validation } from "../../middelware/validation.middleware.js";
import * as tutorSchema from "./tutor.schema.js";
import * as tutorController from "./tutor.controller.js"
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";

const router = Router()

//add new tutor 
router.post(
    '/',
    isAuthenicated,
    isAuthorized("admin"),
    validation(tutorSchema.addTutor) ,
    tutorController.addTutor 
)

//get all tutors 
router.get(
    "/",
    isAuthenicated, 
    tutorController.allTutors
)

//get one tutor
router.get(
    "/:id",
    isAuthenicated,
    validation(tutorSchema.idSchema) , 
    tutorController.getTutor
)

//get tutor by NID
router.get(
    "/nid/:id",
    isAuthenicated,
    validation(tutorSchema.idSchema) , 
    tutorController.getTutorByNID
)

//update tutor 
router.put(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"),
    validation(tutorSchema.updateTutor), 
    tutorController.updateTutor)

//delete tutor 
router.delete(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"),
    validation(tutorSchema.idSchema), 
    tutorController.deleteTutor)

export default router
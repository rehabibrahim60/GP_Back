import { Router } from "express";
import { validation } from "../../middelware/validation.middleware.js";
import * as tutorSchema from "./tutor.schema.js";
import * as tutorController from "./tutor.controller.js"

const router = Router()

//add new tutor 
router.post('/',validation(tutorSchema.addTutor) ,tutorController.addTutor )

//get all tutors 
router.get("/", tutorController.allTutors)

//get one tutor
router.get("/:id",validation(tutorSchema.getTutor) , tutorController.getTutor)

//update tutor 
router.patch("/:id" ,validation(tutorSchema.updateTutor), tutorController.updateTutor)

//delete tutor 
router.delete("/:id" ,validation(tutorSchema.deleteTutor), tutorController.deleteTutor)

export default router
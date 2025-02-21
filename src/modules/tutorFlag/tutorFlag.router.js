import express from "express";
import * as tutorFlagController from "./tutorFlag.controller.js"
import * as tutorFlagSchema from "./tutorFlag.schema.js";
import { validation } from "../../middelware/validation.middleware.js";
import {isAuthenicated} from "../../middelware/authentication.middelware.js"


const router = express.Router();

router.post(
    "/",
    isAuthenicated,
    validation(tutorFlagSchema.createTutorFlag), 
    tutorFlagController.createTutorFlag
    );
router.get(
    "/", 
    isAuthenicated,
    tutorFlagController.getTutorFlags
);
router.get(
    "/search", 
    isAuthenicated,
    tutorFlagController.searchTutorFlags
);//search by comment
router.get(
    "/:id", 
    isAuthenicated,
    validation(tutorFlagSchema.idSchema), 
    tutorFlagController.getTutorFlagById
);
router.patch(
    "/:id",
    isAuthenicated, 
    validation(tutorFlagSchema.updateTutorFlag), 
    tutorFlagController.updateTutorFlag
);
router.delete(
    "/:id", 
    isAuthenicated,
    validation(tutorFlagSchema.idSchema), 
    tutorFlagController.deleteTutorFlag
);
router.get(
    "/searchByFlag",
    isAuthenicated, 
    tutorFlagController.searchByFlagName
);



export default router;

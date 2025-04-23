import express from "express";
import * as sessionController from "./session.controller.js"
import * as sessionSchema from "./session.schema.js"
import { validation } from "../../middelware/validation.middleware.js";
import {fileUpload} from "../../utils/fileUpload.js"
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";


const router = express.Router();

router.post(
    "/",
    isAuthenicated,
    fileUpload([
        "video/mkv", "video/mp4", "video/mov", "video/avi"
    ]).single("video"),
    validation(sessionSchema.createSession),
    sessionController.createSession
);

router.get(
    "/",
    isAuthenicated, 
    sessionController.getAllSessions
); // Get all sessions


router.get(
    "/:id",
    isAuthenicated,
    validation(sessionSchema.idSchema) , 
    sessionController.getSessionById
); // Get session by ID


router.patch(
    "/:id",
    isAuthenicated, 
    fileUpload().single("video"),
    validation(sessionSchema.updateSession), 
    sessionController.updateSession
);// Update session


router.patch(
    "/:id/status",
    isAuthenicated, 
    isAuthorized("quality_member"),
    validation(sessionSchema.updateStatus), 
    sessionController.updateStatus
);// Update status

router.delete(
    "/:id",
    isAuthenicated, 
    validation(sessionSchema.idSchema) , 
    sessionController.deleteSession
); // Delete session
router.get(
    "/search",
    isAuthenicated, 
    sessionController.searchSessions
); // Search sessions by status
router.get(
    "/tutor/:id",
    isAuthenicated, 
    validation(sessionSchema.idSchema) , 
    sessionController.getSessionsByTutorId
); // Get sessions by tutor ID
router.get(
    "/qm/:id", 
    isAuthenicated,
    // validation(sessionSchema.idSchema) , 
    sessionController.getSessionsByUserId
); // Get sessions by qm ID

export default router;

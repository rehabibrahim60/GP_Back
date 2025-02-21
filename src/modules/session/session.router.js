import express from "express";
import * as sessionController from "./session.controller.js"
import * as sessionSchema from "./session.schema.js"
import { validation } from "../../middelware/validation.middleware.js";
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";


const router = express.Router();

router.post(
    "/",
    isAuthenicated, 
    validation(sessionSchema.createSession),
    sessionController.createSession
); // Create a session
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
    validation(sessionSchema.updateSession), 
    sessionController.updateSession
); // Update session
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
); // Search sessions by title/lesson
router.get(
    "/tutor/:id",
    isAuthenicated, 
    validation(sessionSchema.idSchema) , 
    sessionController.getSessionsByTutorId
); // Get sessions by tutor ID
router.get(
    "/qm/:id", 
    isAuthenicated,
    validation(sessionSchema.idSchema) , 
    sessionController.getSessionsByUserId
); // Get sessions by qm ID

export default router;

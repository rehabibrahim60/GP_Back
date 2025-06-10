import { Router } from "express";
import { validation } from "../../middelware/validation.middleware.js";
import * as reportSchema from "./report.schema.js";
import * as reportController from "./report.controller.js"
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";
import multer from 'multer';


const upload = multer({ dest: 'uploads/' });

const router = Router()

//add new report 
router.post(
    '/',
    isAuthenicated,
    upload.fields([{ name: 'video' }, { name: 'pdf' }]),
    // validation(reportSchema.createReport) , 
    reportController.addReport 
)

//get report by session id 
router.get(
    "/:id/session",
    isAuthenicated,
    validation(reportSchema.idSchema) , 
    reportController.getReportBySessionID
)

//get all report  
router.get(
    "/",
    isAuthenicated,
    reportController.allReports
)


//get one report
router.get(
    "/:id",
    isAuthenicated,
    validation(reportSchema.idSchema) , 
    reportController.getreport
)


//update report 
router.patch(
    "/:id" ,
    isAuthenicated,
    validation(reportSchema.updateReport), 
    reportController.updatereport
)

//delete report 
router.delete(
    "/:id" ,
    isAuthenicated,
    validation(reportSchema.idSchema), 
    reportController.deleteReport
)

//get report ==> tutor-friendly version 
router.get(
    "/:id/tutor-view", 
    validation(reportSchema.idSchema),
    reportController.getTutorReport
);

//get all reports per tutor  
router.get(
    "/tutor/:id", 
    validation(reportSchema.idSchema),
    reportController.allReportsPerTutor
);

export default router
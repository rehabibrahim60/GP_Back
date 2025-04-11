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
    // isAuthenicated,
    // isAuthorized("admin"),
    upload.fields([{ name: 'video' }, { name: 'pdf' }]),
    reportController.addReport 
)




export default router
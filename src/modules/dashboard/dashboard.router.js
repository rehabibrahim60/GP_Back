import { Router } from "express";
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import * as dashboardController from './dashboard.controller.js';


const router = Router();

router.get('/stats',isAuthenicated , dashboardController.getDashboardStats);
router.get('/',isAuthenicated, dashboardController.getAllActivities);
router.get('/:userId',isAuthenicated, dashboardController.getQmDashboardStats);

export default router
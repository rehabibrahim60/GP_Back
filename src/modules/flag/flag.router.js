import express from "express";
import * as flagController from "./flag.conroller.js";
import * as flagSchema from "./flag.schema.js";
import { validation } from "../../middelware/validation.middleware.js";

const router = express.Router();

router.post("/", validation(flagSchema.createFlag), flagController.createFlag);
router.get("/", flagController.getFlags);
router.get("/search", flagController.searchFlags);
router.patch("/:id",  validation(flagSchema.updateFlag), flagController.updateFlag);
router.delete("/:id", validation(flagSchema.deleteFlag), flagController.deleteFlag);

export default router;

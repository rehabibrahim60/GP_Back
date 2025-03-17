import { Router } from "express";
import { validation } from "../../middelware/validation.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import * as pdfSchema from "./pdf.schema.js";
import * as pdfController from "./pdf.controller.js";
import { isAuthenicated } from "../../middelware/authentication.middelware.js";


const router = Router();

// Add new PDF
router.post(
    "/",
    isAuthenicated,
    fileUpload().single("file"),
    validation(pdfSchema.addPdf),
    pdfController.addPdf
);

// Get all PDFs
router.get(
    "/",
    isAuthenicated,
    pdfController.allPdfs
);

// Get a single PDF by ID
router.get(
    "/:id",
    isAuthenicated,
    validation(pdfSchema.getPdf),
    pdfController.getPdf
);

// Update a PDF
router.patch(
    "/:id",
    isAuthenicated,
    fileUpload().single("file"),
    validation(pdfSchema.updatePdf),
    pdfController.updatePdf
);

// Delete a PDF
router.delete(
    "/:id",
    isAuthenicated,
    validation(pdfSchema.deletePdf),
    pdfController.deletePdf
);

export default router;

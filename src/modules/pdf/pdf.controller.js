import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Pdf } from "../../../DB/models/pdf.js";
import axios from "axios";

// Add a new PDF
export const addPdf = asyncHandler(async (req, res, next) => {
    // Check if file is provided
    if (!req.file) {
        return next(new Error("PDF file is required!", { cause: 400 }));
    }

    // Upload PDF to Cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/pdfs`,
        resource_type: "raw", // Ensures Cloudinary treats it as a document
    });

    // Create PDF record in DB
    await Pdf.create({
        title: req.body.title,
        grade: req.body.grade,
        lesson: req.body.lesson,
        semester: req.body.semester,
        file: { id: public_id, url: secure_url },
    });

    return res.json({ success: true, message: "PDF added successfully" });
});

// Get all PDFs
export const allPdfs = asyncHandler(async (req, res, next) => {
    const pdfs = await Pdf.find();
    return res.json({ success: true, pdfs });
});

// Update a PDF by ID
export const updatePdf = asyncHandler(async (req, res, next) => {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return next(new Error("PDF not found", { cause: 404 }));

    // Check if a new file is uploaded
    if (req.file) {
        // Delete old file from Cloudinary
        await cloudinary.uploader.destroy(pdf.file.id);

        // Upload new PDF to Cloudinary
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUD_FOLDER_NAME}/pdfs`,
            resource_type: "raw",
        });

        pdf.file = { id: public_id, url: secure_url };
    }

    // Update other fields
    pdf.title = req.body.title ?? pdf.title;
    pdf.grade = req.body.grade ?? pdf.grade;
    pdf.lesson = req.body.lesson ?? pdf.lesson;
    pdf.semester = req.body.semester ?? pdf.semester;

    await pdf.save();
    return res.json({ success: true, message: "PDF updated successfully" });
});

// Get a single PDF by ID
export const getPdf = asyncHandler(async (req, res, next) => {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return next(new Error("PDF not found", { cause: 404 }));

    return res.json({ success: true, pdf });
});

//download pdf 
export const downloadPdf = asyncHandler(async (req, res, next) => {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return next(new Error("PDF not found", { cause: 404 }));
  
    const pdfUrl = pdf.file.url;
  
    // Use axios to get the file as stream
    const response = await axios.get(pdfUrl, {
      responseType: "stream",
    });
  
    // Set headers to simulate file download
    res.setHeader("Content-Disposition", `attachment; filename="${pdf.title}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
  
    // Pipe the stream directly to response
    response.data.pipe(res);
  });


// Delete a PDF by ID
export const deletePdf = asyncHandler(async (req, res, next) => {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return next(new Error("PDF not found", { cause: 404 }));

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(pdf.file.id);

    // Delete PDF from DB
    await Pdf.findByIdAndDelete(pdf._id);

    return res.json({ success: true, message: "PDF deleted successfully" });
});

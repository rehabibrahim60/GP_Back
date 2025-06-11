import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Pdf } from "../../../DB/models/pdf.js";
import axios from "axios";
import { Course } from "../../../DB/models/course.js";

// Add a new PDF
export const addPdf = asyncHandler(async (req, res, next) => {
    // Check if file is provided
    if (!req.file) {
        return next(new Error("PDF file is required!", { cause: 400 }));
    }
    console.log("11111");
    
    const course = await Course.findById(req.body.course_id)
    console.log("222");
    const num_of_pdfs = await Pdf.countDocuments({course_id : req.body.course_id})
    console.log("333");
    const lessonpdf = await Pdf.find({lesson_id : req.body.lesson_id})
    console.log("44444");

    if(lessonpdf.length > 0 ) return next(new Error("lesson already has a pdf", { cause: 409 }));
    console.log("5555");
    if (num_of_pdfs >= course.num_of_lessons) {
        return next(new Error("All course lessons have  pdfs", { cause: 409 }));
    }
console.log("6666");

    // Upload PDF to Cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/pdfs`,
        resource_type: "raw", // Ensures Cloudinary treats it as a document
    });
console.log("7777");
    // Create PDF record in DB
    const pdf = await Pdf.create({
        pdfTitle : req.body.pdfTitle ,
        course_id: req.body.course_id,
        lesson_id: req.body.lesson_id,
        file: { id: public_id, url: secure_url },
    });
console.log("88888");
    return res.json({ success: true, message: "PDF added successfully" , pdf });
});

// Get all PDFs
export const allPdfs = asyncHandler(async (req, res, next) => {
    const pdfs = await Pdf.find().populate("course_id lesson_id");
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
    pdf.pdfTitle = req.body.pdfTitle ?? pdf.pdfTitle;
    pdf.grade = req.body.grade ?? pdf.grade;
    pdf.lesson = req.body.lesson ?? pdf.lesson;
    pdf.semester = req.body.semester ?? pdf.semester;

    await pdf.save();
    return res.json({ success: true, message: "PDF updated successfully" });
});

// Get a single PDF by ID
export const getPdf = asyncHandler(async (req, res, next) => {
    const pdf = await Pdf.findById(req.params.id).populate("course_id lesson_id")
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
    res.setHeader("Content-Disposition", `attachment; filename="${pdf.pdfTitle}.pdf"`);
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

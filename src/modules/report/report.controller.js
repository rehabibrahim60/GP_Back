import { asyncHandler } from "../../utils/asyncHandler.js";
import {Report} from "../../../DB/models/report.js";
import { Session } from "../../../DB/models/session.js";
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import multer from "multer";
import { Pdf } from "../../../DB/models/pdf.js";


//add report
export const addReport = asyncHandler(async (req,res,next)=>{
    
    if (!req.files?.video || !req.files?.pdf) {
        return res.status(400).json({ success: false, message: 'Both video and PDF files are required.' });
    }

    const { session_id } = req.body;

    const video = req.files.video[0];
    const pdf = req.files.pdf[0];

    const form = new FormData();
    form.append('video', fs.createReadStream(video.path), video.originalname);
    form.append('pdf', fs.createReadStream(pdf.path), pdf.originalname);

    

    
        const response = await axios.post(
            'https://37a5-34-169-122-84.ngrok-free.app/analyze-content',
            form,
            { headers: form.getHeaders() }
        );
        const data = response.data;
        console.log(data);
        

    // Example: parse flag list to match bad_word format
    const bad_word = (data.flag || []).map(word => ({
        word: word,
        start_time: "00:00" // You can customize this if your model returns timestamps
    }));


    //add report in db
    const report = await Report.create({
        session_id,
        similarity: data.similarity,
        bad_word: bad_word,
        noisy_detection:data.noisy_detection , // Adjust based on your logic
        key_points: (data.key_points || []).join('\n'),
        summary: data.summary,
        transcript: data.transcript,
        abnormal_times: (data.abnormal_times || []).map(t => ({
            start_time: t.start,
            end_time: t.end
        })),
        total_silence_duration : data.total_silence_duration,
        plot:data.image_base64,
        time_tracking: data.silence_intervals        // Add actual values if available
    })
    
    



    
    //response
    return     res.status(200).json({ message: 'Report saved', report , plot : data.image_base64});
})

//get all reports
export const allReports = asyncHandler(async (req,res,next)=>{
    const reports = await Report.find()
    return res.json({success : true , reports})
})


//find report by session id
export const getReportBySessionID = asyncHandler(async (req,res,next)=>{
    const report = await Report.findOne({session_id : req.params.id})
    if(!report) return next(new Error("report not found" , {cause: 404}))
    return res.json({success : true , report})
})

//delete report
export const deleteReport = asyncHandler(async (req , res , next) =>{
    //check report in database
    const report = await Report.findById(req.params.id)
    if(!report) return next(new Error("report not found" , {cause: 404}))
    await Report.findByIdAndDelete(report._id)
    //send response
    return res.json({success: true , message: "report deleted successfully"})
})

//update report
export const updatereport = asyncHandler(async (req , res , next) =>{
    //check report in database
    const report = await Report.findById(req.params.id)
    if(!report) return next(new Error("report not found" , {cause: 404}))
    console.log(report);
    
    //update report
    report.name = req.body.name ? req.body.name : report.name
    report.id_by_organization = req.body.id_by_organization ? req.body.id_by_organization : report.id_by_organization
    report.phone = req.body.phone ? req.body.phone : report.phone
    report.national_id = req.body.national_id ? req.body.national_id : report.national_id
    //save report
    await report.save()
    //send response
    return res.json({success: true , message: "report updated successfully"})
})

//find one report
export const getreport = asyncHandler(async (req,res,next)=>{
    const report = await Report.findById( req.params.id)
    if(!report) return next(new Error("report not found" , {cause: 404}))
    return res.json({success : true , report})
})

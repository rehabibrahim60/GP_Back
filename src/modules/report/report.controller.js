import { asyncHandler } from "../../utils/asyncHandler.js";
import {Report} from "../../../DB/models/report.js";
import { Session } from "../../../DB/models/session.js";
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import multer from "multer";
import { Pdf } from "../../../DB/models/pdf.js";
import { TutorFlag } from "../../../DB/models/tutorFlag.js";
import { logActivity } from "../../utils/logActivity.js";
import { Types } from "mongoose";
import { Tutor } from "../../../DB/models/tutor.js";


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
            'https://da05-34-13-192-25.ngrok-free.app/analyze-content',
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
    
    
    // Log activity
        await logActivity({
          userId: req.user.id, // assuming you have auth middleware
          action: 'create a new system Report',
          entityType: 'Report',
          entityId: report._id,
        });

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
    
    // Log activity
        await logActivity({
          userId: req.user.id, // assuming you have auth middleware
          action: 'delete system Report',
          entityType: 'Report',
          entityId: report._id,
        });
    
    //send response
    return res.json({success: true , message: "report deleted successfully"})
})

//update report
export const updatereport = asyncHandler(async (req , res , next) =>{
    console.log("🔧 PATCH /report/:id controller reached");
    //check report in database
    const report = await Report.findById(req.params.id)
    if(!report) return next(new Error("report not found" , {cause: 404}))
    console.log(report);
    
    //update report

    report.session_id = req.body.session_id ? req.body.session_id : report.session_id ,
    report.similarity = req.body.similarity ? req.body.similarity : report.similarity  ,
    report.bad_word = req.body.bad_word ? req.body.bad_word : report.bad_word  ,
    report.noisy_detection = req.body.noisy_detection ? req.body.noisy_detection : report.noisy_detection  ,
    report.key_points = req.body.key_points ? req.body.key_points : report.key_points  ,
    report.summary = req.body.summary ? req.body.summary : report.summary  ,
    report.transcript = req.body.transcript ? req.body.transcript : report.transcript  ,
    report.abnormal_times = req.body.abnormal_times ? req.body.abnormal_times : report.abnormal_times  ,
    report.total_silence_duration = req.body.total_silence_duration ? req.body.total_silence_duration : report.total_silence_duration  ,
    report.plot = req.body.image_base64? req.body.image_base64 : report.plot,
    report.time_tracking = req.body.time_tracking ? req.body.time_tracking : report.time_tracking
    report.comments = req.body.comments ? req.body.comments : report.comments
    //save report
    await report.save()
    
    // Log activity
        await logActivity({
          userId: req.user.id, // assuming you have auth middleware
          action: 'Update system Report',
          entityType: 'Report',
          entityId: report._id,
        });
    
    //send response
    return res.json({success: true , message: "report updated successfully"})
})

//find one report
export const getreport = asyncHandler(async (req,res,next)=>{
    const report = await Report.findById( req.params.id)
    if(!report) return next(new Error("report not found" , {cause: 404}))
    return res.json({success : true , report})
})

//get report tutor-friendly version
export const getTutorReport = asyncHandler ( async (req, res, next) => {

    // const report = await Report.findById(req.params.id);
    
    const report = await Report.findById(req.params.id)
    if (!report) return next(new Error("report not found" , {cause: 404}))
        console.log("report:" , report);
        
        
    //get tutor data
    const session = await Session.findById(report.session_id)
    console.log("session",session);
    
    const tutor = await Tutor.findById(session.tutor_id)

    // Tutor-friendly fields
    const similarityScore = report.similarity;
    const badWords = report.bad_word?.map(item => item.word);
    const sessionQuietness = report.noisy_detection;
    const toneOfVoice = report.abnormal_times?.map((t) => 
      `High voice between ${t.start_time} and ${t.end_time}`
    );

    // Silence duration logic
    const silenceSeconds = report.total_silence_duration;

    const tutorFlagsExist =await TutorFlag.find({session_id : report.session_id})
    console.log(tutorFlagsExist);
    

    if (tutorFlagsExist.length == 0){
        // Flag conditions
        if (similarityScore < 80) {
            TutorFlag.create({
                session_id: report.session_id ,
                comment: "Content coverage is low"
            })
        }
        if (badWords.length >= 2) {
            TutorFlag.create({
                session_id: report.session_id ,
                comment: "Too many inappropriate words"
            })
        }
        if (report.abnormal_times.length > 2) {
            TutorFlag.create({
                session_id: report.session_id ,
                comment: "Voice tone is High"
            })
        }
        if (silenceSeconds > 5) {
            TutorFlag.create({
                session_id: report.session_id ,
                comment: "Session had too much silence"
            })
        }
    }
    const flags =await TutorFlag.find({session_id : report.session_id})

    res.json({
        session_id: report.session_id,
        similarityScore,
        badWords,
        sessionQuietness,
        toneOfVoice,
        totalSilenceDuration: report.total_silence_duration,
        tutorFlags: flags,
        comments: report.comments,
        tutor
    });

  
})



export const allReportsPerTutor = asyncHandler(async (req, res, next) => {
console.log(req.params.tutorId);

  const reports = await Report.find()
    .populate({
      path: "session_id",
      match: { tutor_id: req.params.id },
    });

  // Filter out reports where session_id was null (i.e., no match)
  const filteredReports = reports.filter(report => report.session_id !== null);
  const ids = filteredReports.map(r=>r = r._id)

  if (filteredReports.length == 0 ) {
    return next(new Error("No reports found for this tutor", { cause: 404 }));
  }

  return res.json({ success: true, reports: ids });
});

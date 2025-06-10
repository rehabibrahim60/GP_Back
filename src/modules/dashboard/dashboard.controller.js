import { asyncHandler } from "../../utils/asyncHandler.js";

import { Activity } from "../../../DB/models/activity.js";
import { Session } from "../../../DB/models/session.js";
import { Report } from "../../../DB/models/report.js";
import { User } from "../../../DB/models/user.js";


export const getDashboardStats = asyncHandler (async (req, res, next) => {

    const sessions = await Session.countDocuments()
    const reviewedSessions = await Session.countDocuments({status : "done"});
    const tutorReports = await Report.countDocuments();
    const qualityMembers = await User.countDocuments({role:"quality_member"});

    res.json({
      sessions,
      reviewedSessions,
      tutorReports,
      qualityMembers
    });

    // res.status(500).json({ message: 'Server error' });

});

export const getQmDashboardStats = asyncHandler (async (req, res, next) => {

    const yourSessions = await Session.countDocuments({assigned_to:req.params.userId})
    const reviewedSessions = await Session.countDocuments({assigned_to:req.params.userId , status : "done"});
    const distinctTutorIds = await Session.distinct("tutor_id", {
      assigned_to: req.params.userId
    });
    const tutors = distinctTutorIds.length;

    const quality = yourSessions > 0 ? (reviewedSessions / yourSessions * 100) : 0;

    res.json({
      yourSessions,
      reviewedSessions,
      tutors,
      quality : parseInt(quality)
    });

    // res.status(500).json({ message: 'Server error' });

});

export const getAllActivities = asyncHandler (async (req, res) => {

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .populate('userId')
      .populate('entityId')
    console.log(activities);
    
    const formatted = activities.map(act => ({
      date: act.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      action: `${act.userId.name} ${act.action}`
    }));

    res.json(formatted);
  
});



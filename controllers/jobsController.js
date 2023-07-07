const Job = require('../models/jobModel');
const JobType = require('../models/jobTypeModel');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

//create job
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      location: req.body.location,
      jobType: req.body.jobType,
      createdBy: req.user._id
    });
    res.status(201).json({
      success: true,
      job
    })
  } catch (error) {
    next(error);
  }
}

//single job
exports.singleJob = async (req, res, next) => {
  try {
    const job = await Job
      .findById(req.params.id)
      .populate('jobType', 'jobTypeName');

    res.status(200).json({
      success: true,
      job
    })
  } catch (error) {
    next(error);
  }
}

//update job by id.
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job
      .findByIdAndUpdate(req.params.job_id, req.body, { new: true })
      .populate('jobType', 'jobTypeName')
      .populate('createdBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      job
    })
  } catch (error) {
    next(error);
  }
}

exports.showJobs = async (req, res, next) => {
  try {
    const keyword = req.query.keyword ? {
      title: {
        $regex: req.query.keyword,
        $options: 'i'
      }
    } : {};

    const jobTypeCategory = await JobType.find({}, { _id: 1 });
    const cat = req.query.cat || jobTypeCategory.map(cat => cat._id);

    const jobByLocation = await Job.find({}, { location: 1 });
    const setUniqueLocation = [...new Set(jobByLocation.map(val => val.location))];
    const location = req.query.location || setUniqueLocation;

    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Job
      .find({ ...keyword, jobType: cat, location })
      .countDocuments();

    const jobs = await Job
      .find({ ...keyword, jobType: cat, location })
      .sort({ createdAt: -1 })
      .populate('jobType', 'jobTypeName')
      .populate('user', 'firstName')
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.status(200).json({
      success: true,
      jobs,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      setUniqueLocation
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await Job.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "Job deleted"
    })
  } catch (error) {
    next(new ErrorResponse("server error", 500));
  }
};

exports.findApplicant = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    console.log("JOB ID: ", jobId);

    const applicants = await User
      .find({ "jobsHistory.job": jobId }, { password: 0 });

    res.status(200).json({
      success: true,
      applicants
    });
  } catch (error) {
    next(new ErrorResponse("Server error while running findApplicant", 500));
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { userId, applicationId, applicationStatus } = req.body;

    // Find and update the job application status
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        'jobsHistory._id': applicationId
      },
      {
        $set: {
          'jobsHistory.$.applicationStatus': applicationStatus
        }
      },
      {
        new: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User or job application not found'
      });
    }

    // Access the updated job application
    const updatedJobApplication = updatedUser.jobsHistory.find(
      app => app._id.toString() === applicationId
    );

    res.status(200).json({
      success: true,
      message: `Application status updated to "${updatedJobApplication.applicationStatus}"`
    });
  } catch (error) {
    console.log(error);
    next(new ErrorResponse('Server error while updating application status', 500));
  }
};









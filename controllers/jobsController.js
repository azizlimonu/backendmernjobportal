const Job = require('../models/jobModel');
const JobType = require('../models/jobTypeModel');
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
      user: req.user.id
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
    const job = await Job.findById(req.params.id);
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
      .populate('user', 'firstName lastName');

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
    const { keyword, cat, location, pageNumber } = req.query;

    // Prepare the filter conditions
    const filter = {};
    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }
    if (cat) {
      filter.jobType = cat;
    }
    if (location) {
      filter.location = location;
    }

    // Enable pagination
    const pageSize = 5;
    const page = parseInt(pageNumber, 10) || 1;

    // Get the total count of matching documents
    const count = await Job.countDocuments(filter);

    // Fetch the jobs with pagination and filtering
    const jobs = await Job.find(filter)
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
    });
  } catch (error) {
    next(error);
  }
};







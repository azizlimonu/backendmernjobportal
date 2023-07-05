const User = require('../models/userModel');
const ErrorResponse = require('../utils/ErrorResponse');

// get all users
const allUsers = async (req, res, next) => {
  //enable pagination
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User
    .find({})
    .estimatedDocumentCount();

  try {
    const users = await User
      .find()
      .sort({ createdAt: -1 })
      .select('-password')
      .skip(pageSize * (page - 1))
      .limit(pageSize)

    res.status(200).json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count
    })
  } catch (error) {
    return next(error);
  }
}

// show single usser
const singleUser = async (req, res, next) => {
  try {
    const user = await User
      .findById(req.params.id)
      .select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return next(error);
  }
};

// edit user
const editUser = async (req, res, next) => {
  try {
    const user = await User
      .findByIdAndUpdate(req.params.id, req.body)
      .select('-password');

    if (!user) {
      return next(new ErrorResponse("User Not Found", 401));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  try {
    const user = await User
      .findByIdAndRemove(req.params.id)
      .select('-password');

    if (!user) {
      return next(new ErrorResponse("User Not Found", 401));
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully"
    });
  } catch (error) {
    return next(error);
  }
};

// Jobs History
const createUserJobsHistory = async (req, res, next) => {
  const { title, description, salary, location } = req.body;

  try {
    const currentUser = await User
      .findOne({ _id: req.user._id })
      .select('-password');

    if (!currentUser) {
      return next(new ErrorResponse("Login First", 401));
    } else {
      const addJobHistory = {
        title,
        description,
        salary,
        location,
        user: req.user._id
      }
      currentUser.jobsHistory.push(addJobHistory);
      await currentUser.save();
    }
    res.status(200).json({
      success: true,
      currentUser
    });
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  allUsers,
  singleUser,
  editUser,
  deleteUser,
  createUserJobsHistory
};
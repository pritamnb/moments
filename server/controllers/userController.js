const { User } = require('../model/user');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const isEmpty = require('../libs/checkLib');
const bcryptLib = require('../libs/bcryptLib');
const winstonLogger = require('../libs/winstonLib');

/**
 * It will trigger when /user/login called
 * @param {*} req
 * @param {*} res
 */
exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!isEmpty(user)) {
    if (await bcryptLib.isPasswordRight(password, user.password)) {
      const token = user.generateAuthToken();
      winstonLogger.info('User Logged in Successfully');
      let data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        authToken: token,
      };
      return {
        error: false,
        data: data,
        message: 'User Logged in Successfully',
      };
    } else {
      winstonLogger.info('Invalid Emailid or Password provided');
      return {
        error: true,
        message: 'Invalid EmailId or Password',
      };
    }
  } else {
    winstonLogger.info('This EmailId is not registered with BillSplitter');
    return {
      error: true,
      message: 'Invalid EmailId or Password',
    };
  }
};
/**
 * It will trigger when /user/create called
 * @param {*} req
 * @param {*} res
 */
exports.create = async (userData) => {
  try {
    // console.log('user----------', user);
    let oldUser = await User.find({ email: userData.email });
    console.log('oldUser', oldUser);
    if (!isEmpty(oldUser)) {
      winstonLogger.info('User already exists with provided emailId');
      return {
        error: true,
        message: 'User already exists with provided emailId',
      };
    }
    userData.password = await bcryptLib.generateHashedPassword(
      userData.password
    );
    let newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      mobile: userData.mobile,
      createdOn: moment(),
    });
    await newUser.save();
    winstonLogger.info('User created Successfully');
    newUser = newUser.toObject();
    delete newUser.password;

    return {
      error: false,
      data: newUser,
      message: 'User created Successfully',
    };
  } catch (error) {
    console.log('Catch error============', error);
    winstonLogger.error('Something went Wrong in Create User');
    return {
      error: true,
      errorMsg: error,

      message: 'Something went Wrong in Create User',
    };
  }
};
/**
 * It will trigger when /api/user/get-email/:email called
 * @param {*} req
 * @param {*} res
 */
exports.getEmail = async (email, callback) => {
  try {
    const user = await User.findOne({ email: email });
    return callback(null, user);
  } catch (error) {
    return callback('Somenthing went wrong!');
  }
};

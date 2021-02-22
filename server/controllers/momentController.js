const { Moment } = require('../model/moment');
const mongoose = require('mongoose');
const isEmpty = require('../libs/checkLib');
const { fileUpload, deleteFile } = require('../controllers/s3Controller');

exports.createMoment = async (moment) => {
  try {
    console.log('=====moment controller momemt======', moment);
    let oldMoment = await Moment.findOne({ userId: moment.userId });
    console.log('--------old moment-----------', oldMoment);
    if (isEmpty(oldMoment)) {
      let newMoment = new Moment({
        userId: moment.userId,
        moments: [
          {
            tags: moment.tags,
            title: moment.title,
            imageUrl: moment.imageUrl,
          },
        ],
      });
      await newMoment.save();
      return {
        error: false,
        message: 'Moment Created Successfully',
        data: newMoment,
      };
    } else {
      oldMoment.moments.push({
        tags: moment.tags,
        title: moment.title,
        imageUrl: moment.imageUrl,
      });

      await oldMoment.save();
      oldMoment = oldMoment.toObject();
      return {
        error: false,
        data: oldMoment,
        message: 'Moment Created Successfully',
      };
    }
  } catch (error) {
    return {
      error: true,
      errorMsg: error,
      message: 'Something went Wrong!',
    };
  }
};

exports.deleteMoment = async (moment, userId) => {
  try {
    let updateMoment = await Moment.updateOne(
      { userId: userId },
      { $pull: { moments: { _id: moment._id } } },
      { new: true }
    );

    if (updateMoment.nModified == 1) {
      return {
        error: false,
        message: 'Moment Deleted Successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to Delete Moment',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Something Went Wrong',
    };
  }
};

exports.updateMoment = async (moment) => {
  try {
    let result = await Moment.updateOne(
      { userId: moment.userId, 'moments._id': moment.momentId },
      {
        $set: {
          'moments.$.tags': moment.tags,
          'moments.$.title': moment.title,
          'moments.$.imageUrl': moment.imageUrl,
        },
      },
      { new: true }
    );
    if (result.nModified == 1) {
      return {
        error: false,
        Message: 'Moment Updated',
      };
    } else {
      return {
        error: true,
        message: 'Failed to Update',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Something Went Wrong',
    };
  }
};
exports.listMoment = async (req) => {
  try {
    let list = await Moment.findOne({ userId: req.userId });

    if (list) {
      return { error: false, list };
    } else {
      return {
        message: 'User does not contain any list',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Something Went Wrong',
    };
  }
};
exports.getMoment = async (momentId, userId) => {
  try {
    let result = await Moment.find({
      userId: userId,
    });
    let moment = result[0].moments
      .filter((moment) => moment._id.toString() === momentId.toString())
      .map((x) => x);

    if (result) {
      return { error: false, moment };
    } else {
      return {
        error: true,
        message: 'Something Went Wrong',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Something Went Wrong catch ' + error,
    };
  }
};

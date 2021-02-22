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
    console.log(
      '\n----------requested moment------------\n',
      moment,
      '\n====',
      userId
    );

    let updateMoment = await Moment.updateOne(
      { userId: userId },
      { $pull: { moments: { _id: moment._id } } },
      { new: true }
    );
    console.log('\n----------updateMoment------------\n', updateMoment);

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
    console.log('listing moments ======req', req);

    let list = await Moment.findOne({ userId: req.userId });

    console.log('listing moments ====== output', list);

    if (list) {
      return { error: false, list };
    } else {
      return {
        error: true,
        message: 'Something Went Wrong----',
      };
    }
  } catch (error) {
    return {
      error: true,
      message: 'Something Went Wrong+',
    };
  }
};

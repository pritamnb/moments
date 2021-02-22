const express = require('express');
const auth = require('../middleware/auth');
const { fileUpload, deleteFile } = require('../controllers/s3Controller');

const {
  createMoment,
  deleteMoment,
  updateMoment,
  listMoment,
  getMoment,
} = require('../controllers/momentController');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    let moment = {
      userId: req.userId,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      title: req.body.title,
    };
    let result = await createMoment(moment);

    if (result.error) {
      res.status(500).json({
        error: true,
        message: result.message,
      });
    } else {
      res.status(200).json({
        error: false,
        data: result.data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Something Went Wrong!',
    });
  }
});

router.post('/delete', auth, async (req, res) => {
  try {
    console.log('\n----------Request body------------\n', req.body);

    let result = await deleteMoment(req.body, req.userId);

    let fileName = req.body.imageUrl.split('/').pop();
    console.log('\n----------fileName------------\n', fileName);
    let deleteFileS3 = await deleteFile(fileName)
      .then((data) => {
        console.log('deleted from s3', data);
        return true;
      })
      .catch((error) => {
        console.log('error while deleting from s3-----', error);
        return false;
      });
    console.log('\n----------deleteFileS3------------\n', deleteFileS3);

    if (result.error || !deleteFileS3) {
      res.status(500).json({
        error: true,
        message: result.message,
      });
    } else {
      res.status(200).json({
        error: false,
        data: result.data,
        message: 'Moment Deleted Successfully',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Something Went Wrong!',
    });
  }
});

router.put('/update', auth, async (req, res) => {
  try {
    let moment = {
      userId: req.userId,
      tags: req.body.tags,
      momentId: req.body.momentId,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
    };
    console.log('here');
    let result = await updateMoment(moment);

    if (result.error) {
      res.status(500).json({
        error: true,
        message: result.message,
      });
    } else {
      res.status(200).json({
        error: false,
        message: 'Moment Updated Successfully',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Something Went Wrong!',
    });
  }
});
router.get('/moment-list', auth, async (req, res) => {
  try {
    console.log('moment listing', req);
    console.log('\n------------------------\n');
    let result = await listMoment(req);
    console.log('\n------------------------', result);

    if (result.error) {
      res.status(500).json({
        error: true,
        message: result.message,
      });
    } else {
      res.status(200).json({
        error: false,
        list: result.list,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      errorMessage: error,
      message: 'Something Went Wrong!',
    });
  }
});
router.get('/get-moment/:moment_id', auth, async (req, res) => {
  const momentId = req.params.moment_id;
  const userId = req.userId;
  try {
    console.log('moment listing', req);
    console.log('\n------------------------\n');
    let result = await getMoment(momentId, userId);
    console.log('\n------------------------', result);

    if (result.error) {
      res.status(500).json({
        error: true,
        message: result.message,
      });
    } else {
      res.status(200).json({
        error: false,
        moment: result.moment,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      errorMessage: error,
      message: 'Something Went Wrong!',
    });
  }
});

module.exports = router;

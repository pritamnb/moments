const isEmpty = require('../libs/checkLib');
const jwt = require('jsonwebtoken');
const winLogger = require('../libs/winstonLib');

module.exports = async (req, res, next) => {
  if (isEmpty(req.headers['x-access-token'])) {
    winLogger.error('No Token Provided');
    return res.status(404).json({
      error: true,
      message: 'Auth Token Missing',
    });
  } else {
    try {
      const token = jwt.verify(
        req.headers['x-access-token'],
        process.env.JWTSECRET
      );
      console.log('=======Token======', token);

      req.userId = await token.Data.userId;
      console.log('=====userId========', req.userId);
      winLogger.info('Valid Token Provided');
      next();
    } catch (err) {
      winLogger.error('Invalid/ Expired Token Provided');
      return res.status(403).json({
        error: true,
        message: 'Invalid Token Provided',
      });
    }
  }
};

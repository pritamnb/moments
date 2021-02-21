const { History } = require("../model/history");
const winstonLogger = require("../libs/winstonLib");

async function addHistory(data) {
  let history = new History({
    expenseId: data.expenseId,
    groupId: data.groupId,
    message: data.message,
    createdOn: new Date(),
  });

  await history.save();
  winstonLogger.info("Added some history");
  return true;
}

module.exports = addHistory;

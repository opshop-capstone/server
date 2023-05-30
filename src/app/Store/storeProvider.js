const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

exports.getPopularStoreList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeListResult = await storeDao.selectStoreList(connection);
  connection.release();

  return storeListResult;
};

exports.getStoreProducts = async function (storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storProductsResult = await storeDao.selectStoreProducts(
    connection,
    storeId
  );
  connection.release();

  return storProductsResult;
};

exports.getStoreReviews = async function (storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeReviewsResult = await storeDao.selectStoreReviews(
    connection,
    storeId
  );

  connection.release();

  return storeReviewsResult[0];
};

exports.getStoreReviewsScore = async function (storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeReviewsScoreResult = await storeDao.selectStoreReviewsScore(
    connection,
    storeId
  );
  connection.release();
  return storeReviewsScoreResult[0];
};

exports.getStoreInfo = async function (storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeInfo = await storeDao.selectStoreInfo(connection, storeId);
  connection.release();
  return storeInfo;
};

exports.checkSubscribed = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkSubscribeResult = await storeDao.checkSubscribe(
    connection,
    userId,
    storeId
  );
  connection.release();
  return checkSubscribeResult;
};

exports.checkStore = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkStoreResult = await storeDao.checkStore(
    connection,
    userId,
    storeId
  );
  connection.release();

  return checkStoreResult;
};

exports.checkStoreOrder = async function (storeId, orderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkStoreOrderResult = await storeDao.checkStoreOrder(
    connection,
    storeId,
    orderId
  );
  connection.release();

  return checkStoreOrderResult;
};

exports.getOrderedList = async function (storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getOrderedListResult = await storeDao.selectOrderedListForStore(
    connection,
    storeId
  );
  connection.release();

  return getOrderedListResult;
};

exports.getOrderedDetail = async function (orderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getOrderedDetailResult = await storeDao.selectOrderedDetailForStore(
    connection,
    orderId
  );
  connection.release();

  return getOrderedDetailResult;
};

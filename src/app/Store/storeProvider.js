const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

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
  return storeInfo[0];
};

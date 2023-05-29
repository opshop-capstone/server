const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mypageDao = require("./mypageDao");

exports.getMypage = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mypageResult = await mypageDao.selectMypage(connection, userId);
  connection.release();

  return mypageResult;
};

exports.getLikedList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likedListResult = await mypageDao.selectLikedList(connection, userId);
  connection.release();
  return likedListResult;
};

exports.getSubscribeList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const subscribeListResult = await mypageDao.selectSubscribeList(
    connection,
    userId
  );
  connection.release();
  return subscribeListResult;
};

exports.getMyReviewList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myReviewList = await mypageDao.selectMyReviewList(connection, userId);
  connection.release();
  return myReviewList;
};

exports.getMyDetailReview = async function (reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myDetailReview = await mypageDao.selectMyDetailReview(
    connection,
    reviewId
  );
  connection.release();
  return myDetailReview;
};

exports.getMyAddress = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAddressResult = await mypageDao.selectUserAddress(
    connection,
    userId
  );
  connection.release();
  return userAddressResult;
};

exports.getMyOrderList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myOrderListResult = await mypageDao.selectMyOrderList(
    connection,
    userId
  );
  connection.release();
  return myOrderListResult;
};

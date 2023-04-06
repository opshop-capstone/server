const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
    connection,
    selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.getMypage = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mypageResult = await userDao.selectMypage(connection, userId);
  connection.release();

  return mypageResult;
};

exports.getLikedList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likedListResult = await userDao.selectLikedList(connection, userId);
  connection.release();
  return likedListResult;
};

exports.getSubscribeList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const subscribeListResult = await userDao.selectSubscribeList(
    connection,
    userId
  );
  connection.release();
  return subscribeListResult;
};

exports.getMyReviewList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myReviewList = await userDao.selectMyReviewList(connection, userId);
  connection.release();
  return myReviewList;
};

exports.getMyDetailReview = async function (reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myDetailReview = await userDao.selectMyDetailReview(
    connection,
    reviewId
  );
  connection.release();
  return myDetailReview;
};

exports.getMyAddress = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAddressResult = await userDao.selectUserAddress(connection, userId);
  connection.release();
  return userAddressResult[0];
};

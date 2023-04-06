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

exports.getMyAddress = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAddressResult = await userDao.selectUserAddress(connection, userId);
  connection.release();
  return userAddressResult[0];
};

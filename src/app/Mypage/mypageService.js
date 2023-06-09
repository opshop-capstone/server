const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mypageProvider = require("./mypageProvider");
const mypageDao = require("./mypageDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

exports.postMyAddress = async function (
  userId,
  name,
  road_address,
  detail_address,
  zipcode,
  is_main
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const addMyAddress = await mypageDao.insertAddress(connection, [
      userId,
      name,
      road_address,
      detail_address,
      zipcode,
      is_main,
    ]);
    console.log(addMyAddress);
    connection.commit();

    return response(baseResponse.SUCCESS, {
      insertAddressId: addMyAddress.insertId,
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - postMyAddress Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.cancelOrder = async function (userId, orderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const cancelOrderResult = await mypageDao.cancelStatusOrder(connection, [
      userId,
      orderId,
    ]);
    console.log(cancelOrderResult);
    connection.commit();

    return response({
      isSuccess: true,
      code: 1000,
      message: "주문 취소 요청 성공",
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - cancelOrder Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

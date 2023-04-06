const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const storeProvider = require("./storeProvider");
const storeDao = require("./storeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

exports.postStoreReview = async function (
  userId,
  content,
  score,
  imageUrl,
  storeId
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const insertStoreReview = await storeDao.insertReview(connection, [
      userId,
      content,
      Number(score),
      imageUrl,
      storeId,
    ]);

    connection.commit();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    connection.rollback();
    logger.error(`App - insertStoreReview Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.postStoreSubscribe = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkSubscribed = await storeProvider.checkSubscribed(
      userId,
      storeId
    );
    if (checkSubscribed.length > 0) {
      const deleteSubscribe = await storeDao.deleteSubscribe(
        connection,
        userId,
        storeId
      );
      connection.commit();
      return response({
        isSuccess: true,
        code: 1000,
        message: "구독 취소 성공",
      });
    } else {
      const insertSubscribe = await storeDao.insertSubscribe(
        connection,
        userId,
        storeId
      );

      connection.commit();

      return response(
        { isSuccess: true, code: 1000, message: "구독 성공" },
        {
          insertLikeId: insertSubscribe.insertId,
        }
      );
    }
  } catch (err) {
    connection.rollback();
    logger.error(`App - postStoreSubscribe Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

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

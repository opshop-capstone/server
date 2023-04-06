const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const productProvider = require("./productProvider");
const productDao = require("./productDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

exports.postLiked = async function (userId, productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkLiked = await productProvider.checkLiked(userId, productId);
    if (checkLiked.length > 0) {
      const deleteLiked = await productDao.deleteLiked(
        connection,
        userId,
        productId
      );
      connection.commit();
      return response({
        isSuccess: true,
        code: 1000,
        message: "좋아요 제거 성공",
      });
    } else {
      const insertLiked = await productDao.insertLiked(
        connection,
        userId,
        productId
      );

      connection.commit();

      return response(
        { isSuccess: true, code: 1000, message: "좋아요 성공" },
        {
          insertLikeId: insertLiked.insertId,
        }
      );
    }
  } catch (err) {
    connection.rollback();
    logger.error(`App - postLiked Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const cartProvider = require("./cartProvider");
const cartDao = require("./cartDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

exports.insertCartItem = async function (userId, productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // 상품 상태 확인
    const checkProduct = await cartProvider.checkProduct(productId);
    connection.beginTransaction();
    if (checkProduct[0].status != "ACTIVE")
      return errResponse({
        isSuccess: false,
        code: 7001,
        message: "구매불가 상품입니다.",
      });

    const cartParams = [userId, productId];
    // 장바구니에 있는 상품인지 확인
    const checkCartItem = await cartProvider.checkCartItem(cartParams);
    if (checkCartItem.length > 0) {
      return errResponse({
        isSuccess: false,
        code: 7002,
        message: "장바구니에 동일한 상품이 존재합니다.",
      });
    }

    const insertCartResult = await cartDao.insertCart(connection, cartParams);
    connection.commit();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    connection.rollback();
    logger.error(`App - insertCart Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.removeCartItem = async function (userId, productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const products = productId.split(","); //여러개 동시 제거
    connection.beginTransaction();
    products.forEach((productId) => {
      cartDao.removeCart(connection, [userId, productId]);
    });

    connection.commit();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    connection.rollback();
    logger.error(`App - removeCart Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

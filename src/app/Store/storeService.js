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

exports.createStore = async function (
  owner_id,
  store_name,
  content,
  tel,
  email,
  bussiness_code,
  store_image_url
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const isOwner = await storeDao.checkOwner(connection, owner_id);
    if (!isOwner) {
      return response({
        isSuccess: false,
        code: 920,
        message: "상점 주인 인증 단계를 먼저 거치세요. ",
      });
    }

    const insertStore = await storeDao.insertStore(connection, [
      owner_id,
      store_name,
      content,
      tel,
      email,
      bussiness_code,
      store_image_url,
    ]);
    console.log(`추가된 상점: ${insertStore.insertId}`);

    connection.commit();
    return response(baseResponse.SUCCESS, {
      new_store_id: insertStore.insertId,
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - createStore Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.editStore = async function (
  owner_id,
  store_name,
  content,
  tel,
  email,
  store_image_url
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const isOwner = await storeDao.checkOwner(connection, owner_id);
    if (!isOwner) {
      return response({
        isSuccess: false,
        code: 920,
        message: "상점 주인 인증 단계를 먼저 거치세요. ",
      });
    }

    const editStore = await storeDao.updateStore(
      connection,
      owner_id,
      store_name,
      content,
      tel,
      email,
      store_image_url
    );

    connection.commit();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    connection.rollback();
    logger.error(`App - editStore Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.updateOrderStatus = async function (
  owner_id,
  storeId,
  orderId,
  status
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkStore = await storeProvider.checkStore(owner_id, storeId);
    if (checkStore.length == 0) {
      return response({
        isSuccess: false,
        code: 920,
        message: "상점 주인 인증 단계를 먼저 거치세요. ",
      });
    }

    const checkStoreOrder = await storeProvider.checkStoreOrder(
      storeId,
      orderId
    );
    if (checkStoreOrder.length == 0) {
      return response({
        isSuccess: false,
        code: 920,
        message: "해당 상점의 주문이 아닙니다. ",
      });
    }

    status = '"' + status + '"';
    const updateOrderStatus = await storeDao.updateOrderStatus(
      connection,
      orderId,
      status
    );

    if (updateOrderStatus.changedRows == 0) {
      return response({
        isSuccess: false,
        code: 920,
        message: "변경된 상태 없음 ",
      });
    }
    connection.commit();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    connection.rollback();
    logger.error(`App - updateOrderStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

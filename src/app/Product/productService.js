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

// 상품 등록
exports.createProduct = async function (
  userId,
  storeId,
  title,
  price,
  content,
  categoryId,
  size,
  thumbnail_image_url,
  product_image_url
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkStore = await productProvider.checkStore(userId, storeId);
    if (!checkStore) {
      return response({
        isSuccess: false,
        code: 2000,
        message: "상점 사장님이 아니세요.",
      });
    }
    const insertProductParams = [
      storeId,
      title,
      price,
      content,
      categoryId,
      size,
    ];
    const insertProduct = await productDao.insertProduct(
      connection,
      insertProductParams
    );

    url_arr = product_image_url.split(",");

    const insertProductImage = await productDao.insertProductImage(
      connection,
      insertProduct.insertId,
      thumbnail_image_url,
      url_arr
    );
    connection.commit();

    return response(
      { isSuccess: true, code: 1000, message: "상품 등록 성공" },
      {
        new_product_id: insertProduct.insertId,
      }
    );
  } catch (err) {
    connection.rollback();
    logger.error(`App - insertProduct Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// 상품 수정
exports.editProduct = async function (
  userId,
  storeId,
  productId,
  title,
  price,
  content,
  categoryId,
  size
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkStore = await productProvider.checkStore(userId, storeId);
    if (!checkStore) {
      return response({
        isSuccess: false,
        code: 2000,
        message: "상점 사장님이 아니세요.",
      });
    }

    const updateProduct = await productDao.updateProduct(
      connection,
      productId,
      [title, price, content, categoryId, size]
    );

    connection.commit();

    return response({
      isSuccess: true,
      code: 1000,
      message: "상품 내용 수정 성공",
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App -updateProduct Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// 상품 이미지 등록
exports.insertProductImage = async function (
  userId,
  storeId,
  productId,
  product_image_url
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkStore = await productProvider.checkStore(userId, storeId);
    if (!checkStore) {
      return response({
        isSuccess: false,
        code: 2000,
        message: "상점 사장님이 아니세요.",
      });
    }

    url_arr = product_image_url.split(",");

    const insertProductImage = await productDao.insertOnlyProductImage(
      connection,
      productId,
      url_arr
    );
    connection.commit();

    return response({
      isSuccess: true,
      code: 1000,
      message: "이미지 추가 성공",
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - insertProductImage Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// 상품 이미지 제거
exports.deleteProductImage = async function (
  userId,
  storeId,
  productId,
  product_image_url
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkStore = await productProvider.checkStore(userId, storeId);
    if (!checkStore) {
      return response({
        isSuccess: false,
        code: 2000,
        message: "상점 사장님이 아니세요.",
      });
    }

    url_arr = product_image_url.split(",");

    const deleteProductImage = await productDao.deleteProductImage(
      connection,
      productId,
      url_arr
    );
    connection.commit();

    return response({
      isSuccess: true,
      code: 1000,
      message: "이미지 제거 성공",
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - deleteProductImage Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

// 상품 제거
exports.deleteProduct = async function (userId, storeId, productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const checkStore = await productProvider.checkStore(userId, storeId);
    if (checkStore.length == 0) {
      return response({
        isSuccess: false,
        code: 2000,
        message: "상점 사장님이 아니세요.",
      });
    }

    const checkProduct = await productProvider.checkProduct(storeId, productId);
    if (checkProduct.length == 0) {
      return response({
        isSuccess: false,
        code: 2000,
        message: "해당 상점의 상품이 아닙니다.",
      });
    }

    const deleteProduct = await productDao.deleteProduct(connection, productId);
    connection.commit();
    console.log(deleteProduct);
    return response({
      isSuccess: true,
      code: 1000,
      message: "상품 제거 성공",
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - deleteProduct Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

exports.getProductDetail = async function (productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productDetailResult = await productDao.selectProductDetail(
    connection,
    productId
  );
  connection.release();

  return productDetailResult;
};

exports.getProductDetailImages = async function (productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productDetailImageResult = await productDao.selectProductDetailImages(
    connection,
    productId
  );
  connection.release();

  return productDetailImageResult;
};

exports.getCategoryPage = async function () {
  itemList = [];
  for (let i = 1; i < 9; i++) {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoryPageResult = await productDao.selectCategoryPage(
      connection,
      i
    );
    itemList.push(categoryPageResult);
    connection.release();
  }

  return itemList;
};

exports.getSearchProducts = async function (search) {
  const searchParams = "%" + search + "%";
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryPageResultList = await productDao.selectSearchProducts(
    connection,
    searchParams
  );
  connection.release();

  return categoryPageResultList;
};

exports.checkLiked = async function (userId, productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkLikedResult = await productDao.checkLiked(
    connection,
    userId,
    productId
  );
  connection.release();

  return checkLikedResult;
};

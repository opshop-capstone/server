const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

exports.getLikeInfo = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeInfoResult = await productDao.selectLikeInfo(connection);
  connection.release();

  return likeInfoResult;
};

exports.getRecommandProducts = async function (productList) {
  const connection = await pool.getConnection(async (conn) => conn);

  const recommandProductsResult = await productDao.selectRecommandProducts(
    connection,
    productList
  );

  return recommandProductsResult;
};

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

exports.getPopularProductList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const popularProductListResult = await productDao.selectPopularProductList(
    connection
  );
  connection.release();

  return popularProductListResult;
};

exports.getSearchProducts = async function (search) {
  const searchParams = "%" + search + "%";
  const connection = await pool.getConnection(async (conn) => conn);
  const searchProductsResultList = await productDao.selectSearchProducts(
    connection,
    searchParams
  );
  connection.release();

  return searchProductsResultList;
};

exports.getProductsByCategory = async function (categoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productsByCategoryList = await productDao.selectProductsByCategory(
    connection,
    categoryId
  );
  connection.release();

  return productsByCategoryList;
};

exports.getProductsByCategoryAndSearch = async function (categoryId, search) {
  const searchParams = "%" + search + "%";
  const connection = await pool.getConnection(async (conn) => conn);
  const bothProductsResultList =
    await productDao.selectProductsByCategoryAndSearch(
      connection,
      categoryId,
      searchParams
    );
  connection.release();

  return bothProductsResultList;
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

exports.checkStore = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkStoreResult = await productDao.checkStore(
    connection,
    userId,
    storeId
  );
  connection.release();

  return checkStoreResult;
};

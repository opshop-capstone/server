const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const cartDao = require("./cartDao");

exports.getCartItem = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cartItemList = await cartDao.selectCartItemList(connection, userId);

  connection.release();

  return cartItemList;
};

exports.checkProduct = async function (productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkProduct = await cartDao.checkProduct(connection, productId);
  connection.release();

  return checkProduct;
};

exports.checkCartItem = async function (cartParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkCart = await cartDao.checkCart(connection, cartParams);
  connection.release();

  return checkCart;
};

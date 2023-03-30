const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

exports.getStoreProducts = async function (storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storProductsResult = await storeDao.selectStoreProducts(
    connection,
    storeId
  );
  connection.release();

  return storProductsResult;
};

const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");

// exports.getorderItem = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const orderItemList = await orderDao.selectorderItemList(connection, userId);

//   connection.release();

//   return orderItemList;
// };

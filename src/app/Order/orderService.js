const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const orderProvider = require("./orderProvider");
const orderDao = require("./orderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// exports.removeorderItem = async function (userId, productId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   try {
//     const products = productId.split(","); //여러개 동시 제거
//     connection.beginTransaction();
//     products.forEach((productId) => {
//       orderDao.removeorder(connection, [userId, productId]);
//     });

//     connection.commit();

//     return response(baseResponse.SUCCESS);
//   } catch (err) {
//     connection.rollback();
//     logger.error(`App - removeorder Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   } finally {
//     connection.release();
//   }
// };

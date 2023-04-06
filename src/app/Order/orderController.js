const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const { emit } = require("nodemon");

/**
 * 스토어의 상품목록 조회
 */

// exports.getorderProducts = async function (req, res) {
//   const orderId = req.params.orderId;
//   const orderProducts = await orderProvider.getorderProducts(orderId);
//   return res.send(response(baseResponse.SUCCESS, orderProducts));
// };

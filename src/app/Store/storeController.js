const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/store/storeProvider");
const storeService = require("../../app/store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const { emit } = require("nodemon");

/**
 * 스토어의 상품목록 조회
 */

exports.getStoreProducts = async function (req, res) {
  const storeId = req.params.storeId;
  const storeProducts = await storeProvider.getStoreProducts(storeId);
  return res.send(response(baseResponse.SUCCESS, storeProducts));
};

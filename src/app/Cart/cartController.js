const jwtMiddleware = require("../../../config/jwtMiddleware");
const cartProvider = require("../../app/cart/cartProvider");
const cartService = require("../../app/cart/cartService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const { emit } = require("nodemon");

/**
 * 카트에 담긴 상품 목록 조회
 */
exports.getCartItem = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const cartItem = await cartProvider.getCartItem(userId);
  return res.send(response(baseResponse.SUCCESS, cartItem));
};

/**
 * 카트 담기
 */
exports.insertCartItem = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const productId = req.query.productId;
  if (!productId) {
    res.send(
      response({
        isSuccess: false,
        code: 7000,
        message: "상품을 선택해 주세요.",
      })
    );
  }
  const insertcartItem = await cartService.insertCartItem(userId, productId);

  return res.send(insertcartItem);
};

/**
 * 카트에서 아이템 제거
 */
exports.removeCartItem = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const productId = req.query.productId;
  if (!productId) {
    res.send(
      response({
        isSuccess: false,
        code: 7000,
        message: "상품을 선택해 주세요.",
      })
    );
  }
  const removeCartItem = await cartService.removeCartItem(userId, productId);

  return res.send(removeCartItem);
};

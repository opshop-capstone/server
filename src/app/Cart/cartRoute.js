module.exports = function (app) {
  const cart = require("./cartController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 사용자가 담은 장바구니 리스트 조회
  app.get("/opshop/carts", jwtMiddleware, cart.getCartItem);

  // 장바구니 담기
  app.post("/opshop/carts/add", jwtMiddleware, cart.insertCartItem);

  // 장바구니에서 제거
  app.post("/opshop/carts/remove", jwtMiddleware, cart.removeCartItem);
};

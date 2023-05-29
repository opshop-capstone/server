module.exports = function (app) {
  const user = require("./userController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 1. 유저 생성 (회원가입) API
  app.post("/opshop/join", user.postUsers);

  // 로그인 하기 API (JWT 생성)
  app.post("/opshop/login", user.login);

  //결제 준비
  app.post("/opshop/payment", jwtMiddleware, user.payment);

  //결제 승인 요청
  app.get("/opshop/payment/approve", user.payment_success);

  //주문 취소
  app.post("/opshop/orders/:orderId/cancel", jwtMiddleware, user.orderCancel);
};

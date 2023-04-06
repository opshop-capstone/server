module.exports = function (app) {
  const order = require("./orderController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 대출 결제 준비
  //app.post("/opshop/payment", jwtMiddleware, order.payment);

  // 대출 결제 승인 요청
  //app.get("/opshop/payment/approve", order.payment_success);
};

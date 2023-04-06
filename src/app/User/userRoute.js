module.exports = function (app) {
  const user = require("./userController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 1. 유저 생성 (회원가입) API
  app.post("/opshop/join", user.postUsers);

  // 로그인 하기 API (JWT 생성)
  app.post("/opshop/login", user.login);

  //마이페이지
  app.get("/opshop/mypage", jwtMiddleware, user.getMypage);

  //좋아요 상품 목록
  app.get("/opshop/mypage/liked", jwtMiddleware, user.getLikedList);

  //구독한 상점 목록
  app.get("/opshop/mypage/subscribed", jwtMiddleware, user.getSubscribeList);

  //내가 작성한 후기 목록
  app.get("/opshop/mypage/reviews", jwtMiddleware, user.getMyReviewList);

  // 대출 결제 준비
  app.post("/opshop/payment", jwtMiddleware, user.payment);

  // 대출 결제 승인 요청
  app.get("/opshop/payment/approve", user.payment_success);

  //주소 조회
  app.get("/opshop/address", jwtMiddleware, user.getMyAddress);

  //주소 추가
  app.post("/opshop/address", jwtMiddleware, user.postMyAddress);
};

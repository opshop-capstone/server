module.exports = function (app) {
  const mypage = require("./mypageController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //마이페이지
  app.get("/opshop/mypage", jwtMiddleware, mypage.getMypage);

  //좋아요 상품 목록
  app.get("/opshop/mypage/liked", jwtMiddleware, mypage.getLikedList);

  //구독한 상점 목록
  app.get("/opshop/mypage/subscribed", jwtMiddleware, mypage.getSubscribeList);

  //내가 작성한 후기 목록
  app.get("/opshop/mypage/reviews", jwtMiddleware, mypage.getMyReviewList);

  //주소 조회
  app.get("/opshop/mypage/address", jwtMiddleware, mypage.getMyAddress);

  //주소 추가
  app.post("/opshop/mypage/address", jwtMiddleware, mypage.postMyAddress);

  //나의 주문 내역 - 만들어!
  //app.get("/opshop/mypage/orders", jwtMiddleware, mypage.getMyOrderList);
};

module.exports = function (app) {
  const store = require("./storeController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");
  // 상점의 상품 조회
  app.get("/opshop/stores/:storeId", store.getStoreProducts);

  // 상점 구독&취소
  app.post("/opshop/stores/subscribe", jwtMiddleware, store.postSubscribe);

  //상점 리뷰 조회
  app.get("/opshop/stores/:storeId/reviews", store.getStoreReviews);

  //상점 정보
  app.get("/opshop/stores/:storeId/info", store.getStoreInfo);

  // 상점 리뷰 작성
  app.post(
    "/opshop/stores/:storeId/reviews",
    jwtMiddleware,
    store.postStoreReview
  );
};

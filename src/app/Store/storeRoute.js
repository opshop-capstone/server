module.exports = function (app) {
  const store = require("./storeController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //인기 상점 리스트
  app.get("/opshop/stores", store.getPopularStoreList);

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

  /**
   * 상점용
   */

  // 상점 등록
  app.post("/opshop/store-register", jwtMiddleware, store.storeRegister);

  //상점 수정
  app.post("/opshop/store-edit", jwtMiddleware, store.storeEdit);
  // 주문된 상품 리스트 확인
  app.get(
    "/opshop/stores/:storeId/ordered-list",
    jwtMiddleware,
    store.storeGetOrderedList
  );
  // 주문 상품 상세 확인
  app.get(
    "/opshop/stores/:storeId/ordered-detail/:orderId",
    jwtMiddleware,
    store.storeGetOrderedDetail
  );

  // 주문 상품 상태 변경
  app.post(
    "/opshop/stores/:storeId/order-update/:orderId",
    jwtMiddleware,
    store.storeUpdateOrderStatus
  );
};

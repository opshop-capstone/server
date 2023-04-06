module.exports = function (app) {
  const store = require("./storeController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/opshop/stores/:storeId", store.getStoreProducts);
  app.post("/opshop/stores/subscribe", jwtMiddleware, store.postSubscribe);

  app.get("/opshop/stores/:storeId/reviews", store.getStoreReviews);
  app.get("/opshop/stores/:storeId/info", store.getStoreInfo);
  app.post(
    "/opshop/stores/:storeId/reviews",
    jwtMiddleware,
    store.postStoreReview
  );
};

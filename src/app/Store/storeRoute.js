module.exports = function (app) {
  const store = require("./storeController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/opshop/stores/:storeId", store.getStoreProducts);

  app.get("/opshop/stores/:storeId/reviews", store.getStoreReviews);
};

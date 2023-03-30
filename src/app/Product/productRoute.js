module.exports = function (app) {
  const product = require("./productController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/opshop/products/:productId", product.getProductDetail);
  app.get("/opshop/categorys", product.getCategoryPage);
};

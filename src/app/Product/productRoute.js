module.exports = function (app) {
  const product = require("./productController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 상품 상세 조회
  app.get("/opshop/products/:productId", product.getProductDetail);

  // 카테고리 별 상품 조회 (카테고리 페이지)
  app.get("/opshop/categorys", product.getCategoryPage);

  // 전체 상품 조회 + 필터링 추가 필요
  app.get("/opshop/products", product.getSearchProducts);

  // 상품 좋아요&취소
  app.post("/opshop/products/liked", jwtMiddleware, product.postLiked);
};

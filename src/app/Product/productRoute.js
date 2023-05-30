module.exports = function (app) {
  const product = require("./productController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 상품 상세 조회
  app.get("/opshop/products/:productId", product.getProductDetail);

  // 카테고리 별 상품 조회 (카테고리 페이지)
  app.get("/opshop/categories", product.getCategoryPage);

  // 인기 상품 조회 + 검색 필터링
  app.get("/opshop/products", product.getProductsList);

  // 추천 상품 조회
  app.get(
    "/opshop/products/reco/lists",
    jwtMiddleware,
    product.recommandProducts
  );

  // 상품 좋아요&취소
  app.post("/opshop/products/liked", jwtMiddleware, product.postLiked);

  /**
   * 상점의 상품 등록
   */
  app.post(
    "/opshop/stores/:storeId/product-register",
    jwtMiddleware,
    product.registerProduct
  );

  // 상품 수정
  app.post(
    "/opshop/stores/:storeId/product-edit/:productId",
    jwtMiddleware,
    product.editProduct
  );

  // 상품 이미지 추가
  app.post(
    "/opshop/stores/:storeId/product-image-add/:productId",
    jwtMiddleware,
    product.insertProductImage
  );

  // 상품 이미지 제거
  app.post(
    "/opshop/stores/:storeId/product-image-delete/:productId",
    jwtMiddleware,
    product.deleteProductImage
  );
  //상품 제거
  app.post(
    "/opshop/stores/:storeId/product-delete/:productId",
    jwtMiddleware,
    product.deleteProduct
  );
};

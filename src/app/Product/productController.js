const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/product/productProvider");
const productService = require("../../app/product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const { emit } = require("nodemon");

/**
 * 스토어의 상품목록 조회
 */
exports.getProductDetail = async function (req, res) {
  const productId = req.params.productId;
  const productDetail = await productProvider.getProductDetail(productId);
  const productDetailImages = await productProvider.getProductDetailImages(
    productId
  );
  const productList = { info: productDetail, images: productDetailImages };
  return res.send(response(baseResponse.SUCCESS, productList));
};

/**
 * 카테고리 페이지 : 카테고리별로 5개씩 상품 노출
 */
exports.getCategoryPage = async function (req, res) {
  const categoryPage = await productProvider.getCategoryPage();
  return res.send(response(baseResponse.SUCCESS, categoryPage));
};

/**
 * 검색 상품 페이지
 */
exports.getSearchProducts = async function (req, res) {
  const search = req.query.search;
  if (!search) {
    return res.send(
      response({
        isSuccess: false,
        code: 301,
        message: "검색어를 입력해주세요.",
      })
    );
  }
  const searchProducts = await productProvider.getSearchProducts(search);
  return res.send(response(baseResponse.SUCCESS, searchProducts));
};

/**
 * 상품 좋아요
 */
exports.postLiked = async function (req, res) {
  const productId = req.params.productId;
  const userId = req.verifiedToken.userId;
  if (!productId) {
    return res.send(
      response({
        isSuccess: false,
        code: 302,
        message: "상품 ID 입력해주세요.",
      })
    );
  }

  const LikedProduct = await productService.postLiked(userId, productId);
  return res.send(LikedProduct);
};

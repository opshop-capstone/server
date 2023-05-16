const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("./productProvider");
const productService = require("./productService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { CF } = require("nodeml"); //  node.js용 머신러닝 라이브러리
const { emit } = require("nodemon");

/**
 * 스토어의 상품상세 조회
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
 * 인기 상품 페이지 (좋아요 순) + 검색 필터링
 */
exports.getProductsList = async function (req, res) {
  const search = req.query.search;
  const recommand = req.query.recommand;
  const categoryId = req.query.categoryId;

  if (!search && !categoryId) {
    const popularProductList = await productProvider.getPopularProductList();
    return res.send(response(baseResponse.SUCCESS, popularProductList));
  } else if (search && !categoryId) {
    const searchProducts = await productProvider.getSearchProducts(search);
    return res.send(response(baseResponse.SUCCESS, searchProducts));
  } else if (!search && categoryId) {
    const categoryProducts = await productProvider.getProductsByCategory(
      categoryId
    );
    return res.send(response(baseResponse.SUCCESS, categoryProducts));
  } else {
    const bothProducts = await productProvider.getProductsByCategoryAndSearch(
      categoryId,
      search
    );
    return res.send(response(baseResponse.SUCCESS, bothProducts));
  }
};

/**
 * 추천 상품 리스트
 */
exports.recommandProducts = async function (req, res) {
  const userId = req.verifiedToken.userId;

  //모든 좋아요 정보를 가져온다.
  let likeInfoResult = await productProvider.getLikeInfo();
  likeInfoResult = Object.values(JSON.parse(JSON.stringify(likeInfoResult)));

  const cf = new CF(); //User-based CF 알고리즘

  //해당 값이 설정되어 있을경우 일정양에 도달하면 멈추도록 설정하여 속도 개선이 가능하다.
  cf.maxRelatedItem = 10;
  cf.maxRelatedUser = 10;

  // 사용자간 유사도 계산
  cf.train(likeInfoResult, "userId", "productId", "rate");

  // userIdx에게 count개의 pose추천, User의 학습 데이터가 없으면 (좋아요가 없는 유저) 랜덤 추천
  let getRecommendResult = cf.recommendToUser(userId, 10);
  let productList = [];

  //추천 상품 ID 리스트 생성
  for (let i = 0; i < getRecommendResult.length; i++) {
    productList.push(parseInt(getRecommendResult[i].itemId));
  }

  //추천 상품 ID 리스트로 상품 정보 가져옴
  let recommandProductsResult = await productProvider.getRecommandProducts(
    productList
  );
  return res.send(response(baseResponse.SUCCESS, recommandProductsResult));
};

/**
 * 상품 좋아요&취소
 */
exports.postLiked = async function (req, res) {
  const productId = req.query.productId;
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

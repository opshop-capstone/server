const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("./storeProvider");
const storeService = require("./storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const { emit } = require("nodemon");

/**
 * 인기 상점 목록 조회
 */
exports.getPopularStoreList = async function (req, res) {
  const storeList = await storeProvider.getPopularStoreList();
  return res.send(response(baseResponse.SUCCESS, storeList));
};

/**
 * 스토어의 상품목록 조회
 */

exports.getStoreProducts = async function (req, res) {
  const storeId = req.params.storeId;
  const storeProducts = await storeProvider.getStoreProducts(storeId);
  return res.send(response(baseResponse.SUCCESS, storeProducts));
};

/**
 * 스토어의 리뷰
 */
exports.getStoreReviews = async function (req, res) {
  const storeId = req.params.storeId;
  const storeReviews = await storeProvider.getStoreReviews(storeId);
  const storeReviewsScore = await storeProvider.getStoreReviewsScore(storeId);
  return res.send(
    response(baseResponse.SUCCESS, {
      total_score: storeReviewsScore,
      detail: storeReviews,
    })
  );
};

/**
 * 스토어의 정보
 */
exports.getStoreInfo = async function (req, res) {
  const storeId = req.params.storeId;
  const storeInfo = await storeProvider.getStoreInfo(storeId);
  return res.send(response(baseResponse.SUCCESS, storeInfo));
};

/**
 * 스토어의 리뷰 작성
 */
exports.postStoreReview = async function (req, res) {
  const storeId = req.params.storeId;
  const userId = req.verifiedToken.userId;
  const content = req.body.content;
  const score = req.body.score;
  const imageUrl = req.body.imageUrl;

  if (!content) {
    return res.send(
      response({ isSuccess: false, code: 800, message: "본문을 작성해주세요." })
    );
  }
  if (!score)
    return res.send(
      response({ isSuccess: false, code: 801, message: "별점을 작성해주세요." })
    );

  const writeReview = await storeService.postStoreReview(
    userId,
    content,
    score,
    imageUrl,
    storeId
  );

  return res.send(writeReview);
};

/**
 * 스토어 구독
 */
exports.postSubscribe = async function (req, res) {
  const storeId = req.query.storeId;
  const userId = req.verifiedToken.userId;
  if (!storeId) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "상점ID를 입력해주세요.",
      })
    );
  } else {
    const storeSubscribe = await storeService.postStoreSubscribe(
      userId,
      storeId
    );
    return res.send(storeSubscribe);
  }
};

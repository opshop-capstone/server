const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("./storeProvider");
const storeService = require("./storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const regexEmail = require("regex-email");
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

/**
 * 상점 등록
 */
exports.storeRegister = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const { store_name, content, tel, email, bussiness_code, store_image_url } =
    req.body;

  // 빈 값 체크
  if (!store_name)
    return res.send(
      response({ isSuccess: false, code: 900, message: "상점명 입력해주세요" })
    );
  if (!content)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "상점 설명을 입력해주세요",
      })
    );
  if (!tel)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "전화번호를 입력해주세요",
      })
    );
  if (!email)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "이메일을 입력해주세요",
      })
    );
  if (!bussiness_code)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "사업자번호를 입력해주세요",
      })
    );
  if (!store_image_url)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "썸네일 이미지를 입력해주세요",
      })
    );

  // 길이 체크
  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

  // 형식 체크 (by 정규표현식)
  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

  //type 값이 있는 경우
  const storeRegisterResult = await storeService.createStore(
    userId,
    store_name,
    content,
    tel,
    email,
    bussiness_code,
    store_image_url
  );

  return res.send(storeRegisterResult);
};

//상점 수정

exports.storeEdit = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const { store_name, content, tel, email, store_image_url } = req.body;

  // 빈 값 체크
  if (!store_name)
    return res.send(
      response({ isSuccess: false, code: 900, message: "상점명 입력해주세요" })
    );
  if (!content)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "상점 설명을 입력해주세요",
      })
    );
  if (!tel)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "전화번호를 입력해주세요",
      })
    );
  if (!email)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "이메일을 입력해주세요",
      })
    );

  if (!store_image_url)
    return res.send(
      response({
        isSuccess: false,
        code: 900,
        message: "썸네일 이미지를 입력해주세요",
      })
    );

  // 길이 체크
  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

  // 형식 체크 (by 정규표현식)
  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

  const storeEditResult = await storeService.editStore(
    userId,
    store_name,
    content,
    tel,
    email,
    store_image_url
  );

  return res.send(storeRegisterResult);
};

/**
 * 상점용: 해당 상점의 구매 목록 조회
 */
exports.storeGetOrderedList = async function (req, res) {
  const storeId = req.params.storeId;
  const userId = req.verifiedToken.userId;

  if (!storeId) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "상점ID를 입력해주세요.",
      })
    );
  }
  const checkStore = await storeProvider.checkStore(userId, storeId);
  if (checkStore.length == 0) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "상점 주인 인증 실패",
      })
    );
  } else {
    const getOrderedList = await storeProvider.getOrderedList(storeId);
    return res.send(response(baseResponse.SUCCESS, getOrderedList));
  }
};

/**
 * 상점용: 해당 상점의 상세 주문 내역
 */
exports.storeGetOrderedDetail = async function (req, res) {
  const storeId = req.params.storeId;
  const userId = req.verifiedToken.userId;
  const orderId = req.params.orderId;

  if (!storeId) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "상점ID를 입력해주세요.",
      })
    );
  }
  if (!orderId) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "주문ID를 입력해주세요.",
      })
    );
  }
  const checkStore = await storeProvider.checkStore(userId, storeId);
  if (checkStore.length == 0) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "상점 주인 인증 실패",
      })
    );
  } else {
    const getOrderedDetail = await storeProvider.getOrderedDetail(orderId);
    return res.send(response(baseResponse.SUCCESS, getOrderedDetail));
  }
};

/**
 * 상점용: 주문 상태 변경
 */
exports.storeUpdateOrderStatus = async function (req, res) {
  const storeId = req.params.storeId;
  const userId = req.verifiedToken.userId;
  const orderId = req.params.orderId;
  const status = req.query.status;

  if (!storeId) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "상점ID를 입력해주세요.",
      })
    );
  }
  if (!orderId) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "주문ID를 입력해주세요.",
      })
    );
  }
  if (!status) {
    return res.send(
      response({
        isSuccess: false,
        code: 802,
        message: "변경할 상태를 입력해주세요.",
      })
    );
  }

  const updateOrderStatus = await storeService.updateOrderStatus(
    userId,
    storeId,
    orderId,
    status
  );
  return res.send(updateOrderStatus);
};

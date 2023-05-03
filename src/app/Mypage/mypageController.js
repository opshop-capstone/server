const jwtMiddleware = require("../../../config/jwtMiddleware");
const mypageProvider = require("./mypageProvider");
const mypageService = require("./mypageService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const axios = require("../../../node_modules/axios");
const Cache = require("memory-cache");
const CryptoJS = require("crypto-js");

const crypto = require("crypto");

/**
 * 마이페이지 조회
 */
exports.getMypage = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const mypage = await mypageProvider.getMypage(userId);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS, mypage));
};

/**
 * 주소 조회
 */
exports.getMyAddress = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const myAddress = await mypageProvider.getMyAddress(userId);
  return res.send(response(baseResponse.SUCCESS, myAddress));
};

/**
 * 주소 추가
 */
exports.postMyAddress = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const { name, road_address, detail_address, zipcode, is_main } = req.body;

  const setMyAddress = await mypageService.postMyAddress(
    userId,
    name,
    road_address,
    detail_address,
    zipcode,
    is_main
  );
  return res.send(setMyAddress);
};

/**
 * 좋아요 상품 목록 조회
 */
exports.getLikedList = async function (req, res) {
  const userId = req.verifiedToken.userId;

  const getLikedList = await mypageProvider.getLikedList(userId);

  return res.send(response(baseResponse.SUCCESS, getLikedList));
};

/**
 * 구독 상점 목록 조회
 */
exports.getSubscribeList = async function (req, res) {
  const userId = req.verifiedToken.userId;

  const getSubscribeList = await mypageProvider.getSubscribeList(userId);

  return res.send(response(baseResponse.SUCCESS, getSubscribeList));
};

/**
 * 내가 작성한 리뷰 목록+ 상세 리뷰
 */
exports.getMyReviewList = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const reviewId = req.query.reviewId;

  if (!reviewId) {
    const getMyReviewList = await mypageProvider.getMyReviewList(userId);
    return res.send(response(baseResponse.SUCCESS, getMyReviewList));
  } else {
    const getMyDetailReview = await mypageProvider.getMyDetailReview(reviewId);
    return res.send(response(baseResponse.SUCCESS, getMyDetailReview));
  }
};

/**
 * 주문 내역 목록 조회
 */
exports.getMyReviewList = async function (req, res) {
  const userId = req.verifiedToken.userId;

  const getMyOrderList = await mypageProvider.getMyOrderList(userId);
  return res.send(response(baseResponse.SUCCESS, getMyOrderList));
};

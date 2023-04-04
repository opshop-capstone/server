const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const axios = require("../../../node_modules/axios");
const Cache = require("memory-cache");
const CryptoJS = require("crypto-js");

const crypto = require("crypto");

const request = require("request");

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
  /**
   * Body: email, password, nickname
   */
  const { email, password, nickname } = req.body;

  // 빈 값 체크
  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

  // 길이 체크
  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

  // 형식 체크 (by 정규표현식)
  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

  // 기타 등등 - 추가하기

  const signUpResponse = await userService.createUser(
    email,
    password,
    nickname
  );

  return res.send(signUpResponse);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {
  const { email, password } = req.body;

  // TODO: email, password 형식적 Validation

  const signInResponse = await userService.postSignIn(email, password);

  return res.send(signInResponse);
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
  const userIdResult = req.verifiedToken.userId;
  console.log(userIdResult);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * 마이페이지 조회
 */
exports.getMypage = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const mypage = await userProvider.getMypage(userId);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS, mypage));
};

// 대출 결제
let tid;
let userId, itemId, addressId, total_price, quantity, item_price;

exports.payment = async function (req, res) {
  userId = req.verifiedToken.userId; // jwt 토큰에서 받아오는 userId
  itemId = req.body.itemId; //상품ID like ("1,2,3")
  addressId = req.body.addressId; //고객이 설정한 address
  total_price = req.body.total_price; // 상품 전체 가격
  item_price = req.body.item_price; // 제품 당 가격 like("1000,10000,")
  quantity = req.body.quantity; //총 주문 상품 개수

  let headers = {
    Authorization: "KakaoAK " + "09de250ff665b14b4f0fbc5c136f0cf8",
    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  let params = {
    cid: "TC0ONETIME", // 테스트 코드
    partner_order_id: "1",
    partner_user_id: `${userId}`,
    item_name: `오피샵`,
    quantity: quantity,
    total_amount: total_price,
    vat_amount: 0,
    tax_free_amount: 0,
    approval_url: "http://localhost:3000/opshop/payment/approve",
    fail_url: "http://localhost:3000/opshop/payment/fail",
    cancel_url: "http://localhost:3000/opshop/payment/cancel",
  };

  let options = {
    url: "https://kapi.kakao.com/v1/payment/ready",
    method: "POST",
    headers: headers,
    form: params,
  };

  let next_redirect_app_url;

  request(options, function result(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(JSON.parse(body)); //JSON.parse : JSON 문자열의 구문을 분석하고, 그 결과에서 JavaScript 값이나 객체를 생성
      //pc 테스트후 next_redirect_app_url 으로 변경!
      next_redirect_pc_url = JSON.parse(body).next_redirect_pc_url;
      tid = JSON.parse(body).tid;
      console.log(userId, itemId, addressId, total_price, quantity, item_price);
      return res.send(next_redirect_pc_url); // redirect 하는 코드
    } else console.log("대출결제승인요청실패");
  });
};

//대출결제 승인요청
exports.payment_success = async function (req, res) {
  const pg_token = req.query.pg_token;
  let headers = {
    Authorization: "KakaoAK " + "09de250ff665b14b4f0fbc5c136f0cf8",
    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  let params = {
    cid: "TC0ONETIME",
    tid: `${tid}`,
    partner_order_id: "1",
    partner_user_id: `${userId}`,
    pg_token: `${pg_token}`,
  };

  let options = {
    url: "https://kapi.kakao.com/v1/payment/approve",
    method: "POST",
    headers: headers,
    form: params,
  };
  console.log(pg_token, userId, tid, total_price);
  request(options, function result(error, response, body) {
    if (!error && response.statusCode === 200) {
      const insertOrderResult = userService.insertOrderResult(
        userId,
        itemId,
        addressId,
        total_price,
        quantity,
        item_price
      );
      //나중에 결제완료 창으로 redirect되도록 만들예정
      return res.send(insertOrderResult);
    } else {
      console.log("결제 승인 실패", error, response.body);
      return res.send(
        response({ isSuccess: false, code: 8001, message: "결제 승인 실패" })
      );
    }
  });
};

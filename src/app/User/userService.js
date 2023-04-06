const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, nickname) {
  try {
    // 이메일 중복 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const insertUserInfoParams = [email, hashedPassword, nickname];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await userDao.insertUserInfo(
      connection,
      insertUserInfoParams
    );
    console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
  try {
    // 이메일 여부 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length < 1)
      return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

    const selectEmail = emailRows[0].email;

    // 비밀번호 확인
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const selectUserPasswordParams = [selectEmail, hashedPassword];
    const passwordRows = await userProvider.passwordCheck(
      selectUserPasswordParams
    );

    if (passwordRows[0].password !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 계정 상태 확인
    const userInfoRows = await userProvider.accountCheck(email);

    if (userInfoRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    console.log(userInfoRows[0].id); // DB의 userId

    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userId: userInfoRows[0].id,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 기간 365일
    );

    return response(baseResponse.SUCCESS, {
      userId: userInfoRows[0].id,
      jwt: token,
    });
  } catch (err) {
    logger.error(
      `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
        err
      )}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUser = async function (id, nickname) {
  try {
    console.log(id);
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserResult = await userDao.updateUserInfo(
      connection,
      id,
      nickname
    );
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.insertOrderResult = async function (
  userId,
  itemId,
  addressId,
  total_price,
  quantity,
  item_price
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    items = itemId.split(",");
    each_price = item_price.split(",");

    // 주문하려는 상품중에 품절상품 체크 벨리데이션
    for (let i = 0; i < quantity; i++) {
      const checkItemStatus = await userDao.checkItemStatus(
        connection,
        items[i]
      );
      if (checkItemStatus.length == 0) {
        return errResponse({
          isSuccess: false,
          code: 8001,
          message:
            "품절된 상품이 존재합니다. 상품확인 후 주문을 다시 진행해주세요",
        });
      }
    }

    const insertOrders = await userDao.insertOrders(connection, [
      userId,
      total_price,
      addressId,
    ]);

    const orderId = insertOrders.insertId;
    for (let i = 0; i < quantity; i++) {
      const insertOrdersItem = await userDao.insertOrderItems(connection, [
        orderId,
        items[i],
        each_price[i],
      ]);
    }

    connection.commit();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    connection.rollback();
    logger.error(`App - insertOrder Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

exports.postMyAddress = async function (
  userId,
  name,
  road_address,
  detail_address,
  zipcode,
  is_main
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    connection.beginTransaction();

    const addMyAddress = await userDao.insertAddress(connection, [
      userId,
      name,
      road_address,
      detail_address,
      zipcode,
      is_main,
    ]);
    console.log(addMyAddress);
    connection.commit();

    return response(baseResponse.SUCCESS, {
      insertAddressId: addMyAddress.insertId,
    });
  } catch (err) {
    connection.rollback();
    logger.error(`App - postMyAddress Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
  }
};

const mysql = require("mysql2/promise");
const { logger } = require("./winston");

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
  host: "opshop.c5gzkd6xxcsp.ap-northeast-2.rds.amazonaws.com",
  user: "sugang",
  port: "3306",
  password: "su3081802!",
  database: "opshopDB",
});

module.exports = {
  pool: pool,
};

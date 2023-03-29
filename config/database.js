const mysql = require("mysql2/promise");
const { logger } = require("./winston");

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  port: "3306",
  password: "su3081802!",
  database: "capstone",
});

module.exports = {
  pool: pool,
};

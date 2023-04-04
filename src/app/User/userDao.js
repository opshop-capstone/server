// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT id,email, name 
                FROM User 
                WHERE email = ? and status like "ACTIVE";
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User (email, password, name)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, name, password
        FROM User
        WHERE email = ? AND password = ? and status like "ACTIVE"`;
  const selectUserPasswordRow = await connection.query(
    selectUserPasswordQuery,
    selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM User 
        WHERE email = ?and status like 'ACTIVE';`;
  const selectUserAccountRow = await connection.query(
    selectUserAccountQuery,
    email
  );
  return selectUserAccountRow[0];
}

async function selectMypage(connection, userId) {
  const selectUserPageQuery = `
        SELECT name,ranking
        FROM User 
        WHERE id = ? and status like 'ACTIVE';`;
  const selectUserPageRow = await connection.query(selectUserPageQuery, userId);
  return selectUserPageRow[0];
}

async function insertOrders(connection, [userId, total_price, address_id]) {
  const insertOrdersQuery = `
      -- 상품 주문
      insert into Orders (user_id,total_price,address_id) values (?,?,?);
       `;
  const insertOrdersRow = await connection.query(insertOrdersQuery, [
    userId,
    total_price,
    address_id,
  ]);
  return insertOrdersRow[0];
}

async function insertOrderItems(connection, [orderId, itemId, item_price]) {
  const insertOrderItemsQuery = `
      -- 상품 아이템 삽입
      insert into OrderItem(order_id,product_id,price,status) values (?,?,?,'COMPLETE');`;
  const insertOrderItemsRow = await connection.query(insertOrderItemsQuery, [
    orderId,
    itemId,
    item_price,
  ]);
  return insertOrderItemsRow[0];
}

async function checkItemStatus(connection, itemId) {
  const checkItemStatusQuery = `
      -- 상품 상태 체크
      select itemId
      from Product
      where status='ACTIVE' and id=?`;
  const checkItemStatusRow = await connection.query(checkItemStatusQuery, [
    itemId,
  ]);
  return checkItemStatusRow[0];
}
module.exports = {
  selectUserEmail,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectMypage,
  insertOrders,
  insertOrderItems,
  checkItemStatus,
};

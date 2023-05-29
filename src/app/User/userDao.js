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

// 상점 주인 생성
async function insertUserForOwnerInfo(
  connection,
  insertUserForOwnerInfoParams
) {
  const insertUserInfoQuery = `
        INSERT INTO User (email, password, name,type)
        VALUES (?, ?, ?,'OWNER');
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserForOwnerInfoParams
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
/**
 * async function insertOrders(connection, [userId, total_price, address_id]) {
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
} */

async function insertOrderItems(
  connection,
  [userId, itemId, item_price, addressId]
) {
  const insertOrderItemsQuery = `
      -- 상품 아이템 삽입 즉, 주문 하기
      insert into OrderItem (user_id, product_id, price,address_id,status) values (?,?,?,?,'PREPARE');
      `;
  const insertOrderItemsRow = await connection.query(insertOrderItemsQuery, [
    userId,
    itemId,
    item_price,
    addressId,
  ]);
  return insertOrderItemsRow[0];
}

async function updateProductStatusToSOLD(connection, item_id) {
  const updateStatusToSOLDQuery = `

    update Product set status='SOLD' where id=?;
`;
  const updateStatusToSOLDRow = await connection.query(
    updateStatusToSOLDQuery,
    item_id
  );
  return updateStatusToSOLDRow[0];
}

async function updateCartStatusToDELETED(connection, userId, item_id) {
  const updateCartStatusToDELETEDQuery = `
    # 주문 완료한 상품 장바구니에서 제거
    update Cart set status='DELETED',update_at=now() where user_id=? and product_id=?;
  
`;
  const updateCartStatusToDELETEDRow = await connection.query(
    updateCartStatusToDELETEDQuery,
    [userId, item_id]
  );
  return updateCartStatusToDELETEDRow[0];
}

async function updateOrderStatusToCANCEL(connection, user_id, order_id) {
  const updateOrderStatusToCANCELQuery = `
    #주문 취소
    update OrderItem set status='CANCEL',update_at=now() where user_id = ? and id=? ;
  
`;
  const updateOrderStatusToCANCELRow = await connection.query(
    updateOrderStatusToCANCELQuery,
    [user_id, order_id]
  );
  return updateOrderStatusToCANCELRow[0];
}

async function checkItemStatus(connection, item_list) {
  const checkItemStatusQuery = `
      -- 상품 상태 체크
      select id,status
      from Product
      where status='ACTIVE' and id in (${item_list})`;
  const checkItemStatusRow = await connection.query(checkItemStatusQuery);
  return checkItemStatusRow;
}

module.exports = {
  selectUserEmail,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  //insertOrders,
  insertOrderItems,
  checkItemStatus,
  updateProductStatusToSOLD,
  updateCartStatusToDELETED,
  updateOrderStatusToCANCEL,
  insertUserForOwnerInfo,
};

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

async function updateStatusToSOLD(connection, item_id) {
  const updateStatusToSOLDQuery = `
    call updateProductStatusToSold(?) 
`;
  const updateStatusToSOLDRow = await connection.query(
    updateStatusToSOLDQuery,
    item_id
  );
  return updateStatusToSOLDRow[0];
}

async function checkItemStatus(connection, itemId) {
  const checkItemStatusQuery = `
      -- 상품 상태 체크
      select id,status
      from Product
      where status='ACTIVE' and id=?`;
  const checkItemStatusRow = await connection.query(checkItemStatusQuery, [
    itemId,
  ]);
  return checkItemStatusRow[0];
}

async function selectUserAddress(connection, userId) {
  const selectUserAddressQuery = `
      -- 주소 목록 조회
      select name, road_address, detail_address, zipcode,is_main
      from UserAddress
      where user_id=? and status ='ACTIVE';`;
  const selectUserAddressRow = await connection.query(
    selectUserAddressQuery,
    userId
  );
  return selectUserAddressRow[0];
}

async function insertAddress(
  connection,
  [userId, name, road_address, detail_address, zipcode, is_main]
) {
  const insertAddressQuery = `
  -- 주소 추가
  insert into UserAddress (user_id,name,road_address,detail_address,zipcode,is_main) values (?,?,?,?,?,?);`;
  const insertAddressRow = await connection.query(insertAddressQuery, [
    userId,
    name,
    road_address,
    detail_address,
    zipcode,
    is_main,
  ]);
  return insertAddressRow[0];
}

async function selectLikedList(connection, userId) {
  const selectLikedListQuery = `
      -- 좋아요 한 상품 리스트
      select LI.user_id , P.id as product_id, S.id as store_id , S.store_name, PI.url as product_thumbnail , P.title,round(P.price ,0) as price
      from   Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id
      join LikedItem LI on P.id = LI.item_id
      where LI.user_id = ?  and LI.status='ACTIVE' and  S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
      ;
       `;
  const selectLikedListRow = await connection.query(
    selectLikedListQuery,
    userId
  );
  return selectLikedListRow[0];
}
async function selectSubscribeList(connection, userId) {
  const selectSubscribeListQuery = `
      -- 구독 상점 목록
      select LS.store_id ,S.store_name,S.store_image_url
      from LikedStore as LS join Store S on LS.store_id = S.id
      where LS.user_id=? and LS.status='ACTIVE' and s.status='ACTIVE';
       `;
  const selectSubscribeListRow = await connection.query(
    selectSubscribeListQuery,
    userId
  );
  return selectSubscribeListRow[0];
}

async function selectMyReviewList(connection, userId) {
  const selectMyReviewListQuery = `
      -- 내가 작성한 리뷰 목록 
      select R.id as review_id , R.is_satisfy as score, R.store_id, left(R.content,15) as content,SUBSTRING_INDEX(R.imageUrl, ',', 1) as review_thumbnail,date_format(R.update_at,'%Y-%m-%d') as date
      from Review as R
      where R.user_id=? and R.status='ACTIVE';
       `;
  const selectMyReviewListRow = await connection.query(
    selectMyReviewListQuery,
    userId
  );
  return selectMyReviewListRow[0];
}
async function selectMyDetailReview(connection, reviewId) {
  const selectMyDetailReviewQuery = `
    -- 특정 리뷰 조회 (내가 작성한)
    select R.id  as review_id , R.is_satisfy as score, R.store_id, R.content ,R.imageUrl,date_format(R.update_at,'%Y-%m-%d') as date
    from Review as R
    where R.id=? and R.status='ACTIVE';
       `;
  const selectMyDetailReviewRow = await connection.query(
    selectMyDetailReviewQuery,
    reviewId
  );
  return selectMyDetailReviewRow[0];
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
  selectUserAddress,
  insertAddress,
  selectLikedList,
  selectSubscribeList,
  selectMyReviewList,
  selectMyDetailReview,
  updateStatusToSOLD,
};

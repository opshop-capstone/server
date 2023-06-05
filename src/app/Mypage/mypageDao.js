async function selectMypage(connection, userId) {
  const selectUserPageQuery = `
          SELECT name,ranking,email
          FROM User 
          WHERE id = ? and status = 'ACTIVE';`;
  const selectUserPageRow = await connection.query(selectUserPageQuery, userId);
  return selectUserPageRow[0];
}

async function selectUserAddress(connection, userId) {
  const selectUserAddressQuery = `
        -- 주소 목록 조회
        select id as address_id ,name, road_address, detail_address, zipcode,is_main
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
        select LI.user_id , P.id as product_id, S.id as store_id , S.store_name, PI.url as product_thumbnail , P.title,round(P.price ,0) as price,if(P.status='ACTIVE','SALE','SOLDOUT') as status
        from   Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id
        join LikedItem LI on P.id = LI.item_id
        where LI.user_id = ?  and LI.status='ACTIVE' and  S.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
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
        where LS.user_id=? and LS.status='ACTIVE' and S.status='ACTIVE';
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

//수정해
async function selectMyOrderList(connection, userId) {
  const selectMyOrderListQuery = `
        -- 주문 내역 목록 조회 - 주소랑 연락처 
        select OI.id as order_id, OI.product_id ,U.name as orderer, UA.name as address_name,concat(UA.road_address,UA.detail_address) as address , P.title as product_name, OI.price,date_format(OI.update_at,'%Y/%m/%d') as date ,(case when OI.status='PREPARE' then '배송준비중' when OI.status='DELIVERING' then '배송중'
        when OI.status='DELIVERED' then '배송완료' when OI.status='CANCELING' then '주문 취소중' when OI.status='CANCELED' then '취소완료' else '확인중' end) as status
        from OrderItem OI join User U on OI.user_id = U.id
        join Product P on OI.product_id = P.id
        join UserAddress as UA on UA.id = OI.address_id 
        where OI.user_id=1 
        order by date desc; -- 최신순
           `;
  const selectMyOrderListRow = await connection.query(
    selectMyOrderListQuery,
    userId
  );
  return selectMyOrderListRow[0];
}
module.exports = {
  selectMypage,
  selectUserAddress,
  insertAddress,
  selectLikedList,
  selectSubscribeList,
  selectMyReviewList,
  selectMyDetailReview,
  selectMyOrderList,
};

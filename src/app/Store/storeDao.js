async function selectStoreList(connection) {
  const selectStoreListQuery = `
    -- 상점 리스트 조회 - 좋아요 많은 순

   select S.id, S.store_name,S.store_image_url, count(LS.id) as liked
    from Store S left join LikedStore LS on S.id = LS.store_id
    where  S.status='ACTIVE'
    group by LS.store_id
    order by count(LS.id) desc;
  ;`;
  const selectStoreListRow = await connection.query(selectStoreListQuery);
  return selectStoreListRow[0];
}

async function selectStoreProducts(connection, storeId) {
  const selectStoreProductsQuery = `
        select PI.url as product_thumbnail , P.title
        from Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id
        where S.id=? and S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
  ;`;
  const selectStoreProductsRow = await connection.query(
    selectStoreProductsQuery,
    storeId
  );
  return selectStoreProductsRow[0];
}

async function selectStoreReviews(connection, storeId) {
  const selectStoreReviewsQuery = `
    -- 매장 리뷰 조회
  select user.id as uesr_id, user.name as user_name ,R.content, R.is_satisfy as score , date_format(R.create_at ,'%Y/%m/%d') as date,R.imageUrl as review_image 
  from Review R join User user on R.user_id = user.id
  where R.store_id=? and  R.status ='ACTIVE';
  `;
  const selectStoreReviewsRow = await connection.query(
    selectStoreReviewsQuery,
    storeId
  );
  return selectStoreReviewsRow[0];
}

async function selectStoreReviewsScore(connection, storeId) {
  const selectStoreReviewsScoreQuery = `
  -- 매장 리뷰 총점, 개수
  select round(avg(R.is_satisfy),1) as total_score , count(id) as review_cnt
  from Review R
  where R.store_id=? and R.status ='ACTIVE';
  `;
  const selectStoreReviewsScoreRow = await connection.query(
    selectStoreReviewsScoreQuery,
    storeId
  );
  return selectStoreReviewsScoreRow[0];
}

async function selectStoreInfo(connection, storeId) {
  const selectStoreInfoQuery = `
  -- 상품 정보
  select S.id,S.store_name, S.tel,S.email,S.bussiness_code, SA.road_address, SA.detail_address,SA.zipcode
  from Store S join StoreAddress SA on S.id = SA.store_id
  where S.id=? and S.status='ACTIVE';
  `;
  const selectStoreInfoRow = await connection.query(
    selectStoreInfoQuery,
    storeId
  );
  return selectStoreInfoRow[0];
}

async function insertReview(
  connection,
  [userId, content, score, imageUrl, storeId]
) {
  const insertReviewQuery = `
      -- 상품 리뷰 등록
      insert into Review (user_id,content,is_satisfy,imageUrl,store_id) values (?,?,?,?,?);
  `;
  const insertReviewRow = await connection.query(insertReviewQuery, [
    userId,
    content,
    score,
    imageUrl,
    storeId,
  ]);
  return insertReviewRow[0];
}

async function checkSubscribe(connection, userId, storeId) {
  const checkSubscribeQuery = `
        -- 구독 되어있는지 체크
      select id
      from LikedStore
      where user_id=? and store_id = ? and status='ACTIVE';
  `;
  const checkSubscribeRow = await connection.query(checkSubscribeQuery, [
    userId,
    storeId,
  ]);
  return checkSubscribeRow[0];
}

async function deleteSubscribe(connection, userId, storeId) {
  const deleteSubscribeQuery = `
      -- 구독 취소
      delete from LikedStore where user_id=? and store_id=?;
  `;
  const deleteSubscribeRow = await connection.query(deleteSubscribeQuery, [
    userId,
    storeId,
  ]);
  return deleteSubscribeRow[0];
}

async function insertSubscribe(connection, userId, storeId) {
  const insertSubscribeQuery = `
        -- 구독 하기
        insert into LikedStore (user_id,store_id) values (?,?);;
  `;
  const insertSubscribeRow = await connection.query(insertSubscribeQuery, [
    userId,
    storeId,
  ]);
  return insertSubscribeRow[0];
}
module.exports = {
  selectStoreProducts,
  selectStoreReviews,
  selectStoreReviewsScore,
  selectStoreInfo,
  insertReview,
  checkSubscribe,
  deleteSubscribe,
  insertSubscribe,
  selectStoreList,
};

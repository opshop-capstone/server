async function selectStoreList(connection) {
  const selectStoreListQuery = `
    -- 상점 리스트 조회 - 좋아요 + 구매 많은 순 
    select S.id, S.store_name,S.store_image_url,S.content,ifnull(purchase.count,0) as purchase_count ,liked.count as like_count
    from Store as S left join
    
    (select S.id as store_id,count(S.id) as count
    from Store S left join Product P on P.store_id = S.id
        join OrderItem OI on P.id= OI.product_id
    group by S.id) as purchase on purchase.store_id = S.id
    join
    (select S.id as store_id ,count(LS.id) as count
    from Store S left join LikedStore LS on S.id = LS.store_id
    where  S.status='ACTIVE'
    group by LS.store_id) as liked on liked.store_id=S.id
    order by purchase_count+like_count desc;

  ;`;
  const selectStoreListRow = await connection.query(selectStoreListQuery);
  return selectStoreListRow[0];
}

async function selectStoreProducts(connection, storeId) {
  const selectStoreProductsQuery = `
  -- 매장 방문 - 최신 등록 상품 순
  select S.id as store_id ,P.id as product_id,PI.url as product_thumbnail , P.title, round(P.price ,0) as price
  from Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id
  where S.id=? and S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
  order by P.create_at desc ;
        `;
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
  -- 상점 정보
  select S.id,S.store_image_url as store_thumbnail,S.content,S.store_name, S.tel,S.email,S.bussiness_code, SA.road_address, SA.detail_address,SA.zipcode
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

async function checkOwner(connection, userId) {
  const checkOwnerQuery = `
      -- 상점 주인 체크
      select id
      from User
      where id=? and type like 'OWNER' 
  `;
  const checkOwnerRow = await connection.query(checkOwnerQuery, userId);
  return checkOwnerRow[0];
}

async function insertStore(connection, insertStoreParams) {
  const insertStoreQuery = `
      -- 상점 추가 (등록)
      insert into Store ( owner_id, store_name, content, tel, email, bussiness_code, store_image_url) values (?,?,?,?,?,?,?)
  `;
  const insertStoreRow = await connection.query(
    insertStoreQuery,
    insertStoreParams
  );
  return insertStoreRow[0];
}

async function updateStore(
  connection,
  owner_id,
  store_name,
  content,
  tel,
  email,
  store_image_url
) {
  const updateStoreQuery = `
      -- 상점 수정
      update Store set store_name=if(${store_name}="",store_name,${store_name}), content=if(${content}="",content,${content}),
                       tel=if(${tel}="",tel,${tel}), email=if(${email}="",email,${email}),
                       ,store_image_url=if(${store_image_url}="",store_image_url,${store_image_url}) 
                   where owner_id=?;
  `;
  const updateStoreRow = await connection.query(updateStoreQuery, owner_id);
  return updateStoreRow[0];
}

async function checkStore(connection, userId, storeId) {
  const checkStoreQuery = `
    select id
    from Store
    where owner_id=? and id=? and status='ACTIVE'
    `;
  const checkStoreRow = await connection.query(checkStoreQuery, [
    userId,
    storeId,
  ]);
  return checkStoreRow[0];
}

async function checkStoreOrder(connection, storeId, orderId) {
  const checkStoreQuery = `
    select oi.id
    from OrderItem oi join Product p on oi.product_id= p.id
        join Store s on p.store_id=s.id
    where s.id=? and oi.id=?
    `;
  const checkStoreRow = await connection.query(checkStoreQuery, [
    storeId,
    orderId,
  ]);
  return checkStoreRow[0];
}

async function selectOrderedListForStore(connection, storeId) {
  const selectOrderedListForStoreQuery = `
  -- 주문된 상품 리스트 확인 
    select OI.id as order_id,OI.status as order_status,date_format(OI.create_at,'%Y-%m-%d %H:%i') as order_date,U.name as orderer , P.id as product_id , P.title,P.price
    from OrderItem OI join Product P on OI.product_id = P.id join Store S on P.store_id = S.id join User U on OI.user_id = U.id
    where S.id=?
    order by order_date desc;
    `;
  const selectOrderedListForStoreRow = await connection.query(
    selectOrderedListForStoreQuery,
    [storeId]
  );
  return selectOrderedListForStoreRow[0];
}

async function selectOrderedDetailForStore(connection, orderId) {
  const selectOrderedDetailForStoreQuery = `
  -- 주문된 상품 상세내역
  select OI.id as order_id, date_format(OI.create_at,'%Y-%m-%d %H:%i') as order_date, OI.status , U.name as orderer, UA.name as address_name, UA.road_address ,UA.detail_address,S.id as store_id, P.id as product_id , P.title,P.price
  from OrderItem OI join Product P on OI.product_id = P.id join Store S on P.store_id = S.id join UserAddress UA on OI.address_id = UA.id
      join User U on OI.user_id = U.id
  where OI.id=?
    
    `;
  const selectOrderedDetailForStoreRow = await connection.query(
    selectOrderedDetailForStoreQuery,
    [orderId]
  );
  return selectOrderedDetailForStoreRow[0];
}

async function updateOrderStatus(connection, orderId, status) {
  const updateOrderStatusQuery = `
  -- 주문된 상품 상세내역
  update OrderItem set status= ${status} where id=${orderId}
    
    `;
  const updateOrderStatusRow = await connection.query(updateOrderStatusQuery);
  return updateOrderStatusRow[0];
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
  checkOwner,
  insertStore,
  updateStore,
  checkStore,
  selectOrderedListForStore,
  selectOrderedDetailForStore,
  updateOrderStatus,
  checkStoreOrder,
};

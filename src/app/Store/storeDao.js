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
  select user.id as uesr_id, user.name as user_name ,R.content, R.is_satisfy as score , date_format(R.create_at ,'%Y/%m/%d') as date
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

module.exports = {
  selectStoreProducts,
  selectStoreReviews,
  selectStoreReviewsScore,
};

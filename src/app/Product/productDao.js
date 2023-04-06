async function selectProductDetail(connection, productId) {
  const selectProductDetailQuery = `
  -- 특정 상품 상세 조회 
    select S.id as store_id,S.store_name , P.title, round(P.price ,0) as price, P.content,P.size,C.name as category
    from Product P join Store S on P.store_id = S.id
    join Category C on P.category_id = C.id
    where  P.id= ? and P.status='ACTIVE'  and S.status='ACTIVE';
    `;
  const selectProductDetailRow = await connection.query(
    selectProductDetailQuery,
    productId
  );
  return selectProductDetailRow[0];
}

async function selectProductDetailImages(connection, productId) {
  const selectProductDetailImagesQuery = `
            select PI.url as product_image
            from ProductImage PI join Product P on PI.product_id = P.id
            where P.id=? and PI.status='ACTIVE' and P.status='ACTIVE';
      `;
  const selectProductDetailImagesRow = await connection.query(
    selectProductDetailImagesQuery,
    productId
  );
  return selectProductDetailImagesRow[0];
}

async function selectCategoryPage(connection, categoryId) {
  const selectCategoryPageQuery = `
        select C.id as category_id, C.name as category, P.id as product_id ,PI.url as product_thumbnail , P.title as product_title
        from Product P join ProductImage PI on P.id = PI.product_id join Category C on P.category_id = C.id
        where C.id=? and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
        limit 5;
  
        `;
  const selectCategoryPageRow = await connection.query(
    selectCategoryPageQuery,
    categoryId
  );
  return selectCategoryPageRow[0];
}

async function selectSearchProducts(connection, searchParams) {
  const selectSearchProductsQuery = `
      -- 검색 상품 리스트
      select P.id as product_id, S.id as store_id , S.store_name,PI.url as product_thumbnail , P.title,round(P.price ,0) as price
      from Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id
      where (P.title like ? or P.content like ?)  and S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
      ;
  
        `;
  const selectSearchProductsRow = await connection.query(
    selectSearchProductsQuery,
    [searchParams, searchParams]
  );
  return selectSearchProductsRow[0];
}

async function selectProductsByCategory(connection, categoryId) {
  const selectProductsByCategoryQuery = `
      -- 카테고리별 상품 리스트
      select  S.id as store_id,S.store_name ,P.id as product_id , P.title, round(P.price ,0) as price,PI.url as product_thumbnail ,C.id as category_id,C.name as category
      from Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id join Category C on P.category_id = C.id
      where C.id=? and S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
      ;
  
        `;
  const selectProductsByCategoryRow = await connection.query(
    selectProductsByCategoryQuery,
    categoryId
  );
  return selectProductsByCategoryRow[0];
}

async function selectProductsByCategoryAndSearch(
  connection,
  categoryId,
  searchParams
) {
  const selectProductsByCategoryAndSearchQuery = `
      -- 카테고리별 검색 상품 리스트
      select S.id as store_id,S.store_name ,P.id as product_id , P.title, round(P.price ,0) as price,PI.url as product_thumbnail ,C.id as category_id,C.name as category
      from Store S join Product P on S.id = P.store_id join ProductImage PI on P.id = PI.product_id join Category C on C.id = P.category_id
      where C.id=? and (P.title like ? or P.content like ?)  and S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and PI.status='ACTIVE'
      ;
  
        `;
  const selectProductsByCategoryAndSearchRow = await connection.query(
    selectProductsByCategoryAndSearchQuery,
    [categoryId, searchParams, searchParams]
  );
  return selectProductsByCategoryAndSearchRow[0];
}

async function insertLiked(connection, userId, productId) {
  const insertLikedQuery = `
      -- 상품 좋아요
      insert into LikedItem (user_id, item_id) values (?,?);
      ; `;
  const insertLikedRow = await connection.query(insertLikedQuery, [
    userId,
    productId,
  ]);
  return insertLikedRow[0];
}

async function checkLiked(connection, userId, productId) {
  const checkLikedQuery = `
      -- 상품 좋아요 여부 확인 
      select id
      from LikedItem
      where user_id=? and item_id = ? and status='ACTIVE'
      ; `;
  const checkLikedRow = await connection.query(checkLikedQuery, [
    userId,
    productId,
  ]);
  return checkLikedRow[0];
}

async function deleteLiked(connection, userId, productId) {
  const deleteLikedQuery = `
      -- 상품 좋아요 취소 
      delete from LikedItem where user_id=? and item_id=?
      ; `;
  const deleteLikedRow = await connection.query(deleteLikedQuery, [
    userId,
    productId,
  ]);
  return deleteLikedRow[0];
}
module.exports = {
  selectProductDetail,
  selectProductDetailImages,
  selectCategoryPage,
  selectSearchProducts,
  insertLiked,
  checkLiked,
  deleteLiked,
  selectProductsByCategory,
  selectProductsByCategoryAndSearch,
};

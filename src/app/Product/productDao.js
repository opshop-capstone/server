async function selectProductDetail(connection, productId) {
  const selectProductDetailQuery = `
  -- 특정 상품 상세 조회
    select S.store_name , P.title, P.price, P.content,P.size,C.name as category
    from Product P join Store S on P.store_id = S.id
    join Category C on P.category_id = C.id
    where  P.id=? and P.status='ACTIVE'  and S.status='ACTIVE';
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
module.exports = {
  selectProductDetail,
  selectProductDetailImages,
  selectCategoryPage,
};

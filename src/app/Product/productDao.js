async function selectProductDetail(connection, productId) {
  const selectProductDetailQuery = `
  -- 특정 상품 상세 조회 
    select S.id as store_id,S.store_name , P.title, round(P.price ,0) as price, P.content,P.size,ifnull(x.likeCnt,0) as like_count,C.name as category
    from Product P join Store S on P.store_id = S.id
    join Category C on P.category_id = C.id
    left join (
      select LI.item_id, count(*) likeCnt
      from LikedItem LI
      group by LI.item_id
    ) x on x.item_id = P.id
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
          select group_concat(PI.url separator ',') as product_image
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

async function selectPopularProductList(connection) {
  const selectPopularProductListQuery = `
  -- 인기 상품 (좋아요순) 리스트 
  select P.id as product_id ,S.id as store_id, S.store_name,P.title,round(P.price ,0) as price, PI.url as thumbnail,ifnull(x.likeCnt,0) as like_count,C.name as category
  from Product P join ProductImage PI on P.id = PI.product_id
      join Store S on S.id = P.store_id
     left join (
  select LI.item_id, count(*) likeCnt
  from LikedItem LI
  group by LI.item_id
) x on x.item_id = P.id
join Category C on P.category_id = C.id
  where  S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES'
order by like_count desc
 ;
    `;
  const selectPopularProductListRow = await connection.query(
    selectPopularProductListQuery
  );
  return selectPopularProductListRow[0];
}

async function selectSearchProducts(connection, searchParams) {
  const selectSearchProductsQuery = `
      -- 검색 상품 리스트
      select P.id as product_id ,S.id as store_id, S.store_name,P.title,round(P.price ,0) as price, PI.url as thumbnail,ifnull(x.likeCnt,0) as like_count,C.name as category
      from Product P join ProductImage PI on P.id = PI.product_id
          join Store S on S.id = P.store_id
         left join (
      select LI.item_id, count(*) likeCnt
      from LikedItem LI
      group by LI.item_id
    ) x on x.item_id = P.id
    join Category C on P.category_id = C.id
      where  S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and (P.title like ? or P.content like ? or S.store_name like ?) 
      order by like_count desc
     ;

  
        `;
  const selectSearchProductsRow = await connection.query(
    selectSearchProductsQuery,
    [searchParams, searchParams, searchParams]
  );
  return selectSearchProductsRow[0];
}

async function selectProductsByCategory(connection, categoryId) {
  const selectProductsByCategoryQuery = `
      -- 카테고리별 상품 리스트
    
select P.id as product_id ,S.id as store_id, S.store_name,P.title,round(P.price ,0) as price, PI.url as thumbnail,ifnull(x.likeCnt,0) as like_count,C.name as category
      from Product P join ProductImage PI on P.id = PI.product_id
          join Store S on S.id = P.store_id
         left join (
      select LI.item_id, count(*) likeCnt
      from LikedItem LI
      group by LI.item_id
    ) x on x.item_id = P.id
    join Category C on P.category_id = C.id
      where  S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and category_id=?
      order by like_count desc
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
  -- 카테고리 별 검색
  select P.id as product_id ,S.id as store_id, S.store_name,P.title,round(P.price ,0) as price, PI.url as thumbnail,ifnull(x.likeCnt,0) as like_count,C.name as category
  from Product P join ProductImage PI on P.id = PI.product_id
      join Store S on S.id = P.store_id
     left join (
  select LI.item_id, count(*) likeCnt
  from LikedItem LI
  group by LI.item_id
) x on x.item_id = P.id
join Category C on P.category_id = C.id
  where  S.status='ACTIVE' and P.status='ACTIVE' and PI.is_thumbnail='YES' and  C.id=? and (P.title like ? or P.content like ? or S.store_name like ?) 
  order by like_count desc
 ;
  
        `;
  const selectProductsByCategoryAndSearchRow = await connection.query(
    selectProductsByCategoryAndSearchQuery,
    [categoryId, searchParams, searchParams, searchParams]
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

async function selectLikeInfo(connection) {
  const selectLikeInfoQuery = `
  -- 좋아요 정보 조회 for 추천 데이터 
    select user_id as userId, item_id as productId,10 as rate
    from LikedItem
    where status='ACTIVE'
    `;
  const selectLikeInfoRow = await connection.query(selectLikeInfoQuery);
  return selectLikeInfoRow[0];
}

async function selectRecommandProducts(connection, productList) {
  let Query = `
  -- 추천 상품 목록 조회
  select P.id as product_id , P.store_id,S.store_name,P.title,PI.url as thumbnail,P.price, ifnull(x.likeCnt, 0) as like_count,C.name as category
  from Product P
    left join (
        select LI.item_id, count(*) likeCnt
        from LikedItem LI
        group by LI.item_id
      ) x on x.item_id = P.id
      join Store S on P.store_id = S.id
      join ProductImage PI on P.id = PI.product_id
      join Category C on P.category_id = C.id
  where P.status = 'ACTIVE' and P.id in (${productList}) and PI.is_thumbnail='YES'
  ORDER BY FIELD(P.id,${productList});
  -- FIELD 함수를 이용하여 특정한 값을 우선적으로 정렬할 수 있다.
    `;
  const recommandData = await connection.query(Query);

  Query = `
  -- 추천 안된 상품 목록
    select P.id as product_id , P.store_id,S.store_name,P.title,PI.url as thumbnail,P.price, ifnull(x.likeCnt, 0) as like_count,C.name as category
    from Product P
      left join (
          select LI.item_id, count(*) likeCnt
          from LikedItem LI
          group by LI.item_id
        ) x on x.item_id = P.id
      join Store S on P.store_id = S.id
      join ProductImage PI on P.id = PI.product_id
      join Category C on P.category_id = C.id
    where P.status = 'ACTIVE' and P.id not in (${productList}) and PI.is_thumbnail='YES'
    ORDER BY P.create_at desc;
  `;
  const normalData = await connection.query(Query);
  const productsRow = recommandData[0].concat(normalData[0]);
  return productsRow;
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

async function insertProduct(connection, insertProductParams) {
  const insertProductQuery = `
      insert into Product (store_id,title,price,content,category_id,size) values(?,?,?,?,?,?);
  `;
  const insertProductRow = await connection.query(
    insertProductQuery,
    insertProductParams
  );
  return insertProductRow[0];
}

async function insertProductImage(
  connection,
  productId,
  thumbnail_image_url,
  url_arr
) {
  let query = `insert into ProductImage (product_id,url,is_thumbnail) values 
                (${productId},"${thumbnail_image_url}",'YES')`;

  for (let i = 0; i < url_arr.length; i++) {
    query += `,(${productId},"${url_arr[i]}",'NO')`;
  }
  const insertProductQuery = query + ";";

  const insertProductImageRow = await connection.query(insertProductQuery);
  return insertProductImageRow[0];
}

async function updateProduct(
  connection,
  productId,
  [title, price, content, categoryId, size]
) {
  const updateProductQuery = `
      update Product set title=if("${title}"="",title,"${title}"),price=if("${price}"="",price,"${price}"),content=if("${content}"="",content,"${content}"),category_id=if("${categoryId}"="",category_id,"${categoryId}"),size=if("${size}"="",size,"${size}") where id=${productId}; 
                `;

  const updateProductRow = await connection.query(updateProductQuery);
  return updateProductRow[0];
}

async function insertOnlyProductImage(connection, productId, url_arr) {
  let query = `insert into ProductImage (product_id,url,is_thumbnail) values 
                (${productId},"${url_arr[0]}",'NO')`;

  for (let i = 1; i < url_arr.length; i++) {
    query += `,(${productId},"${url_arr[i]}",'NO')`;
  }
  const insertProductQuery = query + ";";
  const insertProductImageRow = await connection.query(insertProductQuery);
  return insertProductImageRow[0];
}

async function deleteProductImage(connection, productId, url_arr) {
  let query = `delete from ProductImage where product_id=${productId} and url in ("${url_arr[0]}"`;
  for (let i = 1; i < url_arr.length; i++) {
    query += `,"${url_arr[i]}"`;
  }

  const deleteProductImageQuery = query + `);`;
  const deleteProductImageRow = await connection.query(deleteProductImageQuery);
  return deleteProductImageRow[0];
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
  selectPopularProductList,
  selectLikeInfo,
  selectRecommandProducts,
  checkStore,
  insertProduct,
  insertProductImage,
  updateProduct,
  insertOnlyProductImage,
  deleteProductImage,
};

async function selectCartItemList(connection, userId) {
  const selectCartItemListQuery = `
        -- 장바구니 조회
        select  P.id as product_id,P.title , PI.url,round(P.price ,0) as price,P.status as product_status
        from User U join Cart C on U.id = C.user_id join Product P on P.id = C.product_id
        join ProductImage PI on P.id = PI.product_id
        where C.status='ACTIVE' and U.id = ? and PI.is_thumbnail='YES';
        -- 장바구니 합계는 프론트에서!!
    `;
  const selectCartItemListRow = await connection.query(
    selectCartItemListQuery,
    userId
  );
  return selectCartItemListRow[0];
}

async function checkProduct(connection, productId) {
  const checkProductQuery = `
          -- 상품 상태 조회
          select  id as product_id,status
          from Product
          where id=?
          ;
      `;
  const checkProductRow = await connection.query(checkProductQuery, productId);
  return checkProductRow[0];
}

async function checkCart(connection, cartParams) {
  const checkCartQuery = `
    -- 장바구니 조회
    select id
    from Cart
    where user_id=? and product_id=? and status='ACTIVE'
            ;
        `;
  const checkCartRow = await connection.query(checkCartQuery, cartParams);
  return checkCartRow[0];
}

async function insertCart(connection, insertCartParams) {
  const insertCartQuery = `
    insert into Cart (user_id,product_id)values (?,?) ;
        `;
  const insertCartRow = await connection.query(
    insertCartQuery,
    insertCartParams
  );
  return insertCartRow[0];
}

async function removeCart(connection, cartParams) {
  const removeCartQuery = `
        -- 장바구니 제거
        DELETE FROM Cart where user_id=? and product_id=? ;
          `;
  const removeCartRow = await connection.query(removeCartQuery, cartParams);
  return removeCartRow[0];
}
module.exports = {
  selectCartItemList,
  checkProduct,
  checkCart,
  insertCart,
  removeCart,
};

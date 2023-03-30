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

module.exports = {
  selectStoreProducts,
};

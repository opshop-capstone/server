// async function removeCart(connection, cartParams) {
//     const removeCartQuery = `
//           -- 장바구니 제거
//           DELETE FROM Cart where user_id=? and product_id=? ;
//             `;
//     const removeCartRow = await connection.query(removeCartQuery, cartParams);
//     return removeCartRow[0];
//   }
module.exports = {};

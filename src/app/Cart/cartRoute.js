module.exports = function (app) {
  const cart = require("./cartController");

  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/opshop/carts", jwtMiddleware, cart.getCartItem);
  app.post("/opshop/carts/add", jwtMiddleware, cart.insertCartItem);
  app.post("/opshop/carts/remove", jwtMiddleware, cart.removeCartItem);
};

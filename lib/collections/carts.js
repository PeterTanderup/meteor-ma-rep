Carts = new Mongo.Collection('carts');

Carts.getCarts = function (userKey) {
  var cart = Carts.findOne({userKey: userKey});
  if (!cart) {
    cart = {
      userKey: userKey,
      email: null,
      name: null,
      ip: null,
      createdAt: new Date(),
      itemCount: 0,
      total: 0,
      items: [],
      notes: [{
        note: 'cart created',
        createdAt: new Date()
      }],
      status: 'open'
    };
  }
  return cart;
};
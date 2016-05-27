Template.productsShow.events({
  'click #add-to-cart': function (e) {
    e.preventDefault();
    addToCart(this.sku, function (err, res) {
      Router.go('cartShow');
    });
  }
});
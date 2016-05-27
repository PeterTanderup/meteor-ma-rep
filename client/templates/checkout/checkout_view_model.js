import ko from '../../scripts/knockout-3.3.0.js';

CheckoutViewModel = function(args) {
  var self = this;

  //basics
  this.name = ko.observable(args.name);
  this.email = ko.observable(args.email);
  this.description = ko.computed(function() {
    return 'Checkout for ' + self.name();
  });

  //shipping address
  this.shippingAddress = {};
  var addressKeys = _.keys(args.address);
  _.each(addressKeys, function(key) {
    self.shippingAddress[key] = ko.observable(args.address[key]);
  });

  //instrumentation
  this.termsAccepted = ko.observable(false);
  this.showCheckoutForm = ko.observable(true);
  this.showProgressBar = ko.computed(function() {
    return !self.showCheckoutForm();
  });
  this.needShipping = ko.computed(function() {
    return !(self.shippingAddress.street() &&
    self.shippingAddress.city() &&
    self.shippingAddress.state() &&
    self.shippingAddress.zip());
  });

  this.needNameAndEmail = ko.computed(function() {
    return !(self.name() && self.email());
  });

  this.processor = ko.observable('stripe');

  this.paymentReady = ko.computed(function() {
    //terms need to be accepted, shipping filled out, name and email
    var ready = (!self.needNameAndEmail() &&
    !self.needShipping() &&
    self.termsAccepted());

    return ready;
  });

  //submission
  this.loadStripeCheckout = function() {

    var handler = StripeCheckout.configure({
      //should be set in settings
      key: Meteor.settings.public.stripePublicKey,
      image: '/images/logo-small.png',
      zipCode : true,
      email : self.email(),
      allowRememberMe : true,
      address : true,
      token: handleToken
    });

    handler.open({
      name: 'The Rocket Shop',
      description: checkoutModel.description(),
      amount: currentCart.total
    });
  };

  handleToken = function(token) {

    //turn off the checkout form
    window.scrollTo(0,0);
    self.showCheckoutForm(false);

    //we have the token, tack the information we need onto the cart, then send it off
    var checkout = {
      name : self.name(),
      email : self.email(),
      description : self.description(),
      ip : token.clientIp,
      countryCode : token.card.country,
      cartId : currentCart._id,
      shippingAddress : {
        street : self.shippingAddress.street(),
        street2 : self.shippingAddress.street(),
        city : self.shippingAddress.street(),
        state : self.shippingAddress.street(),
        country : self.shippingAddress.street(),
        zip : self.shippingAddress.street()
      },
      billingAddress : {
        street : token.card.addressLine1,
        street2 : token.card.addressLine2,
        city : token.card.addressCity,
        state : token.card.addressState,
        country : token.card.addressCountry,
        zip : token.card.addressZip
      },
      token : token
    };

    //call to processCharge
    processPayment(checkout,function(err,res) {
      if (res.success) {
        //console.log(res);
        Router.go('receiptShow', {id: res.receiptId});
      }else {
        sAlert.error(res.message);
      }
    });
  };

};
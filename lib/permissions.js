isAdmin = function () {
  var loggedInUser = Meteor.user();
  var result = false;
  if (loggedInUser) {
    if (Roles.userIsInRole(loggedInUser, ['Admin'])) {
      result = true;
    }
  }
  return result;
};
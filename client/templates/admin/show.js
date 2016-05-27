Template.adminShow.helpers({
  userList: function () {
    return Meteor.users.find({});
  }
});
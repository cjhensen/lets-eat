// Dependencies
const uuid = require('uuid');

const Users = {

  // createNewUser:
  // creates a new user with specified username and password
  // Gives random uuid
  // Sets up storate for placeHistory, placesLiked, and placesDisliked
  create: function(username, password) {
    const user = {
      userInfo: {
        id: uuid.v4(),
        username: username,
        password: password
      },
      history: [],
      liked: [],
      disliked: []
    }

    this.users.push(user);
    return user;
  },

  get: function(user, arrayToGet) {
    const id = user.userInfo.id;
    let selectedArray = [];
    // if users model id matches user id being passed in,
    // get the array specified
    this.users.find(function(usr) {
      if(usr.userInfo.id === id) {
        selectedArray = usr[arrayToGet];
      }
    });
    return selectedArray;
  },

  update: function(user, arrayToUpdate, itemToAdd) {
    const id = user.userInfo.id;

    // if users model id matches user id being passed in,
    // add item to specified array: history, liked, or disliked
    this.users.find(function(usr) {
      if(usr.userInfo.id === id) {
        usr[arrayToUpdate].push(itemToAdd);
      }
    });
  }

}

function createUsersModel() {
  const storage = Object.create(Users);
  storage.users = [];
  return storage;
}

module.exports = {Users: createUsersModel()};
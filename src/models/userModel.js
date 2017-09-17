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
      placeHistory: [],
      placesLiked: [],
      placesDisliked: []
    }

    this.users.push(user);
    return user;
  }

}

function createUsersModel() {
  const storage = Object.create(Users);
  storage.users = [];
  return storage;
}

module.exports = {Users: createUsersModel()};
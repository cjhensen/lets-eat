
// Globals
global.__base = __dirname + '/';
global.__components = __dirname + '/components';
global.APP_CONTAINER = $('#le-app');

const leUtilities = require('./utilities');
const models = require('./models');
const components = require('./components');

components.restaurantSearch.restaurantSearch.runApp();
console.log('components built', components, leUtilities, models);
console.log('__base', __base, __components);

// Create a global test user
const {Users} = models.userModel;
global.TEST_USER = Users.create("christian", "password");
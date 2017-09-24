
// Globals
console.log('SETTING UP GLOBALS');
global.__base = __dirname + '/';
global.__components = __dirname + '/components';
global.APP_CONTAINER = $('#le-app');

console.log('REQUIRING UTILITIES, MODELS, COMPONENTS');
const leUtilities = require('./utilities');
const models = require('./models');
const components = require('./components');

console.log('RUNNING APP');
components.restaurantSearch.restaurantSearch.runApp();
console.log('components built', components, leUtilities, models);
console.log('__base', __base, __components);

// Create a global test user
const {Users} = models.userModel;
global.TEST_USER = Users.create("christian", "password");
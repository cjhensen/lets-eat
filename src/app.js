// Globals
global.__base = __dirname + '/';
global.__components = __dirname + '/components';
global.APP_CONTAINER = $('#le-app');

const leUtilities = require('./utilities');
const components = require('./components');

components.restaurantSearch.restaurantSearch.runApp();
console.log('components built', components, leUtilities);
console.log('__base', __base, __components);
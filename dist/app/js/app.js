(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":4,"./v4":5}],2:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],3:[function(require,module,exports){
(function (global){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":2,"./lib/rng":3}],5:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":2,"./lib/rng":3}],6:[function(require,module,exports){
(function (global,__dirname){

// Globals
console.log('SETTING UP GLOBALS');
global.__base = __dirname + '/';
global.__components = __dirname + '/components';

console.log('REQUIRING GLOBALS, UTILITIES, MODELS, COMPONENTS');
const globals = require('./globals');
const leUtilities = require('./utilities');
const models = require('./models');
const components = require('./components');

console.log('RUNNING APP');
components.restaurantSearch.restaurantSearch.runApp();
console.log('components built', components, leUtilities, models);
console.log('__base', __base, __components);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},"/src")
},{"./components":7,"./globals":29,"./models":30,"./utilities":32}],7:[function(require,module,exports){
module.exports = {
  restaurantChoose: require('./restaurantChoose'),
  restaurantSearch: require('./restaurantSearch'),
  restaurantVisited: require('./restaurantVisited'),
  restaurantDetails: require('./restaurantDetails'),
  leLoader: require('./leLoader'),
  leMenu: require('./leMenu'),
  restaurantLists: require('./restaurantLists')
};
},{"./leLoader":8,"./leMenu":11,"./restaurantChoose":14,"./restaurantDetails":17,"./restaurantLists":20,"./restaurantSearch":23,"./restaurantVisited":26}],8:[function(require,module,exports){
module.exports = {
  leLoader: require('./leLoader'),
  leLoaderTmpl: require('./leLoader-tmpl')
};
},{"./leLoader":10,"./leLoader-tmpl":9}],9:[function(require,module,exports){
// leLoader-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="le-loader js-loader">
        <div class="animation-2">
          <div class="box1"></div>
          <div class="box2"></div>
          <div class="box3"></div>
          <div class="box4"></div>
          <div class="box5"></div>
        </div>
      </div>
    `;

    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};
},{"../../utilities/utilities":34}],10:[function(require,module,exports){
// leLoader

  // Dependencies
  const globals = require('../../globals');
  const pubSub = require('../../utilities/pubSub');
  const leLoaderTmpl = require('./leLoader-tmpl');

  // DOM
  const component = '.js-loader';
  const template = $(leLoaderTmpl.generateTemplate());

  // Subscribed Events
  pubSub.on('renderLoader', handleRenderLoader);
  pubSub.on('destroyLoader', handleDestroyLoader);

  function handleRenderLoader() {
    render();
  }

  function handleDestroyLoader() {
    destroy();
  }

  function render(container) {
    container = container || globals.APP_CONTAINER;
    
    console.log('leLoader render');
    container.prepend(template);
  }

  function destroy(container) {
    container = container || globals.APP_CONTAINER;
    console.log('leLoader destroy');
    
    // need to pass in a container in order to make it testable
    if(container.find(component).length) {
      container.find(component).remove();
    }

  }

module.exports = {
  render: render,
  destroy: destroy
};
},{"../../globals":29,"../../utilities/pubSub":33,"./leLoader-tmpl":9}],11:[function(require,module,exports){
module.exports = {
  leMenu: require('./leMenu'),
  leMenuTmpl: require('./leMenu-tmpl')
};
},{"./leMenu":13,"./leMenu-tmpl":12}],12:[function(require,module,exports){
// leMenu-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');


  function generateTemplate() {
    const template = `
      <div class="le-menu js-menu">
        <h2>Let's Eat</h2>
        <ul class="nav">
          <li class="nav-item"><a href="/app" data-item="search">Search</a></li>
          <li class="nav-item"><a href="#" data-item="history">History</a></li>
          <li class="nav-item"><a href="#" data-item="liked">Liked</a></li>
          <li class="nav-item"><a href="#" data-item="disliked">Disliked</a></li>
          <li class="nav-item"><a href="/logout" data-item="log">Log Out</a></li>
        </ul>
        <input type="checkbox" id="nav-trigger" class="nav-trigger le-menu-toggle" />
        <label for="nav-trigger"></label>
      </div>
    `;

    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};
},{"../../utilities/utilities":34}],13:[function(require,module,exports){
// leMenu

  // Dependencies
  const globals = require('../../globals');
  const pubSub = require('../../utilities/pubSub');
  const leMenuTmpl = require('./leMenu-tmpl');

  // DOM
  const component = '.js-menu';
  const template = $(leMenuTmpl.generateTemplate());
  const leMenuToggle = `${component} .le-menu-toggle`;
  const leMenuNav = `${component} nav`;
  const leMenuNavItem = `${component} .nav-item a`;

  // handleMenuClicked:
  // on menu button click, show menu
  function handleMenuClicked() {
    console.log('handleMenuClicked');
    toggleMenu();
  }

  function toggleMenu() {
    $('.site-wrap').toggleClass('nav-open');
    $('.nav').toggleClass('nav-visible');
    $('.nav-trigger').toggleClass('nav-trigger-open');
    $('label[for="nav-trigger"]').toggleClass('nav-trigger-open');
    $('.le-menu h2').toggleClass('nav-trigger-open');
  }

  // handleMenuItemClicked:
  // on menu item clicked, bring to that view, and hide menu
  function handleMenuItemClicked() {
    console.log('handleMenuItemClicked');
    // bring to appropriate view
    // get the item clicked in the menu
    // send event to restaurantLists with the item to render the appropriate component
    const itemClicked = $(this).attr('data-item');
    if(itemClicked === "history" || itemClicked === "liked" || itemClicked === "disliked") {
      event.preventDefault();
      pubSub.emit('renderRestaurantList', {itemClicked: itemClicked});
      toggleMenu();
    }
    if(itemClicked === "search") {
      pubSub.emit('renderRestaurantSearch');
      toggleMenu();
    }
  }

  function assignEventHandlers() {
    globals.NAV_CONTAINER.on('click', leMenuToggle, handleMenuClicked);
    globals.NAV_CONTAINER.on('click', leMenuNavItem, handleMenuItemClicked);
  }

  function render(container) {
    container = container || globals.APP_CONTAINER;

    console.log('leMenu render');
    container.append(template);
  }

  render(globals.NAV_CONTAINER);
  assignEventHandlers();

  module.exports = {
    render: render
  }
},{"../../globals":29,"../../utilities/pubSub":33,"./leMenu-tmpl":12}],14:[function(require,module,exports){
module.exports = {
  restaurantChoose: require('./restaurantChoose'),
  restaurantChooseTmpl: require('./restaurantChoose-tmpl')
};
},{"./restaurantChoose":16,"./restaurantChoose-tmpl":15}],15:[function(require,module,exports){
// restaurantChoose-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');


  function generateTemplate(options) {

    // options:
    // title, rating, img_src, img_alt, restaurantVisitedComponent
    options = options || "";

    const template = `
      <div class="js-restaurant-choose le-restaurant-choose">
        <div class="col-xs-12 col-md-4 col-md-offset-4">
          <button type="button" class="btn btn-back js-btn-back">Back</button>
        </div>
        <div class="info-place col-xs-12 col-md-4 col-md-offset-4">
          <h4 class="js-title">${options.title}</h4>
          <span class="js-rating rating-stars">${options.rating} stars</span>
        </div>
        <div class="img-place col-xs-12 col-md-4 col-md-offset-4">
          <img class="js-img" src="${options.img_src}" alt="${options.img_alt}">
        </div>
        <div class="choose-controls clearfix">
          <button type="button" class="btn js-btn-eat col-xs-12 col-md-4 col-md-offset-4">Eat Here!</button>
          <button type="button" class="btn js-btn-already-visited col-xs-12 col-md-4 col-md-offset-4">Already been here</button>
          <button type="button" class="btn js-btn-next col-xs-12 col-md-4 col-md-offset-4">Not feeling this place</button>
        </div><!-- / choose-controls -->

        <!-- insert restaurantVisited component -->
        ${options.restaurantVisitedComponent}
      </div>
      `;

      return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};
},{"../../utilities/utilities":34}],16:[function(require,module,exports){
// restaurantChoose

  // Dependencies
  // utilities.shuffleArray
  const globals = require('../../globals');
  const utilities = require('../../utilities/utilities');
  const pubSub = require('../../utilities/pubSub');
  const restaurantChooseTmpl = require('./restaurantChoose-tmpl');
  const restaurantVisitedTmpl = require('../restaurantVisited/restaurantVisited-tmpl');

  // DOM
  const componentContainer = globals.APP_CONTAINER.find('.js-restaurant-choose-container');
  const component = '.js-restaurant-choose';
  let template = $(restaurantChooseTmpl.generateTemplate());
  const btnNextResult = `${component} .js-btn-next`;
  const btnEat = `${component} .js-btn-eat`;
  const btnAlreadyVisited = `${component} .js-btn-already-visited`;
  const btnBack = `${component} .js-btn-back`;
  const imgLink = `${component} .js-link-show-details`;
  const templateOptions = {};

  // Embedded Components
  let restaurantVisitedComponent = restaurantVisitedTmpl.generateTemplate();
  templateOptions.restaurantVisitedComponent = restaurantVisitedComponent;
  console.log('restaurantVisitedComponent', restaurantVisitedComponent);


  // Subscribed Events
  // first set the local data to the received data
  pubSub.on('processSearchResults', handleReceivedSearchResults);
  // then populate the serach result on the page
  pubSub.on('processSearchResults', populateSearchResult);
  pubSub.on('showNextSearchResult', populateSearchResult);
  pubSub.on('renderRestaurantSearch', destroy);
  pubSub.on('renderRestaurantList', destroy);

  // module variables
  let localSearchResultData = [];
  let currentSearchResultIndex = 0;

  let objForInsert = {};

  // handleBtnBackClicked:
  // destroy choose view
  // render restaurant search view in restaurantSearch
  function handleBtnBackClicked() {
    console.log('handleNextBtnClicked');
    destroy();
    pubSub.emit('renderRestaurantSearch');
  }

  // handleBtnEatClicked
  // open new window with yelp page
  // add item to history in db
  function handleBtnEatClicked() {
    console.log('handleBtnEatClicked');
    console.log(localSearchResultData[currentSearchResultIndex-1]);
    window.open(localSearchResultData[currentSearchResultIndex-1].url, '_blank');

    let data = {
      "history" : objForInsert
    };

    utilities.makeDbRequest('PUT', data).then(function(data) {
      console.log('added to db');
    }).catch(function(err) {
      console.log(err);
    });
  }

  // handleImgLinkClicked:
  // prevent default scroll to top
  // emit event to send current restaurant to restaurantDetails so it can be displayed
  function handleImgLinkClicked(event) {
    console.log('handleImgLinkClicked');
    event.preventDefault();
    pubSub.emit('showDetailsView', localSearchResultData[currentSearchResultIndex-1]);
  }

  // handleNextBtnClicked:
  // show a different result when user clicks next btn ('Not feeling this place')
  function handleNextBtnClicked() {
    console.log('handleNextBtnClicked');
    console.log('btnNextResult', btnNextResult);
    populateSearchResult();

    pubSub.emit('destroyDetailsView');
  }

  // handleAlreadyVisitedBtnClicked
  // sends user and restaurant to restaurantVisited to show the popup with the two go 
  // again/wouldn't go again buttons in it and make those buttons add to their respective lists
  function handleAlreadyVisitedBtnClicked() {
    console.log('handleAlreadyVisitedBtnClicked');

    toggleChooseBlur();
    
    // Send currently shown restaurant in event to be added to liked/disliked from restaurantVisited popup
    pubSub.emit('displayVisitedPopup', {restaurant: localSearchResultData[currentSearchResultIndex-1]});
  }

  function toggleChooseBlur() {
    $('.info-place').toggleClass('visited-open');
    $('.img-place').toggleClass('visited-open');
    $('.choose-controls').toggleClass('visited-open');
  }

  // handleReceivedSearchResults:
  // Callback function for receiving search results from restaurantSearch.
  // Sets the results passed in to a local variable for reuse.
  // Clears existing data on new search by resetting the array, since this function is
  // only called on pubSub event when a new search is submitted.
  function handleReceivedSearchResults(searchResultData) {
    console.log('handleReceivedSearchResults');
    
    // reset local data and index on new search
    localSearchResultData = [];
    currentSearchResultIndex = 0;

    // set local data equal to received search result data
    localSearchResultData = searchResultData.data;

    // set objForInsert

    let tryNew = searchResultData.tryNew;
    console.log('try new in handleReceivedSearchResults', tryNew);


    // if tryNew is true
    if(tryNew) {
      
      let userHistory = []; 

      utilities.makeDbRequest('GET', 'history').then(function(data) {
        userHistory = data;

        // Replace localSearchResultData with only the places
        // where the user has not been
        localSearchResultData = localSearchResultData.filter(function(placeObj) {
          return !userHistory.some(function(placeObj2) {
            return placeObj.id == placeObj2.id;
          });
        });

      }).catch(function(err) {
        console.log(err);
      });
    }


    // shuffle localSearchResultData for showing a random result
    // is it better to only shuffle indexes? 
    utilities.shuffleArray(localSearchResultData);
  }

  // populateSearchResult:
  // fill in template with local copy of search result data,
  // then render
  // Note* I am not handling the data being received in the pubsub for this function (no parameter)
  // TODO: show something on last result
  function populateSearchResult() {
    console.log('populateSearchResult');

    console.log('localSearchResultData', localSearchResultData);

    if(currentSearchResultIndex < localSearchResultData.length) {
      templateOptions.title = localSearchResultData[currentSearchResultIndex].name;
      templateOptions.rating = localSearchResultData[currentSearchResultIndex].rating;
      templateOptions.img_src = localSearchResultData[currentSearchResultIndex].image_url;
      templateOptions.img_alt = localSearchResultData[currentSearchResultIndex].name;

      // set objForInsert
      objForInsert = {
        id: localSearchResultData[currentSearchResultIndex].id, 
        name: localSearchResultData[currentSearchResultIndex].name, 
        price: localSearchResultData[currentSearchResultIndex].price, 
        rating: localSearchResultData[currentSearchResultIndex].rating, 
        url: localSearchResultData[currentSearchResultIndex].url, 
        image_url: localSearchResultData[currentSearchResultIndex].image_url
      };

      // increment index for next result
      currentSearchResultIndex++;

      pubSub.emit('renderRestaurantChoose');
      render();
      pubSub.emit('destroyLoader');

      console.log('templateOptions', templateOptions);

    } else {
      console.log('end of result list');
    }

  }

  // assignEventHandlers:
  // assigns event handlers for component element events
  function assignEventHandlers() {
    console.log('assignEventHandlers');

    // Need to bind event handlers to parent DOM, so new elements added or replaced
    // don't lose their event functionality
    componentContainer.on('click', btnNextResult, handleNextBtnClicked);
    componentContainer.on('click', btnAlreadyVisited, handleAlreadyVisitedBtnClicked);
    componentContainer.on('click', imgLink, handleImgLinkClicked);
    componentContainer.on('click', btnBack, handleBtnBackClicked);
    componentContainer.on('click', btnEat, handleBtnEatClicked);
  }

  // render the view to the page
  function render() {
    console.log('restaurantChoose render');
    template = $(restaurantChooseTmpl.generateTemplate(templateOptions));
    componentContainer.html(template);
  }

  // destroy:
  // remove component from dom
  function destroy() {
    if($(component).length) {
      console.log('restaurantSearch destroy');
      $(component).remove();
    }
  }

  assignEventHandlers();

module.exports = {
  render: render
};
},{"../../globals":29,"../../utilities/pubSub":33,"../../utilities/utilities":34,"../restaurantVisited/restaurantVisited-tmpl":27,"./restaurantChoose-tmpl":15}],17:[function(require,module,exports){
module.exports = {
  restaurantDetails: require('./restaurantDetails'),
  restaurantDetailsTmpl: require('./restaurantDetails-tmpl')
};
},{"./restaurantDetails":19,"./restaurantDetails-tmpl":18}],18:[function(require,module,exports){
const restaurantDetailsTmpl = (function() {
  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  function generateTemplate(options) {

    options = options || "";
    // title, rating, price, img_src, img_alt, address, phone, yelp_url
    console.log('optionssss', options);

    const template = `
      <div class="js-restaurant-details le-restaurant-details">
        <button type="button" class="btn btn-back js-btn-back">Back</button>
        <div class="top-info">
          <span class="details-title">${options.title}</span>
          <span class="details-rating">${options.rating}</span>
          <span class="details-price">${options.price}</span>
        </div>
        <div class="details-img">
          <img src="${options.img_src}" alt="${options.img_alt}">
        </div>
        <div class="bottom-info">
          <div class="details-address">
            ${options.address_1}
            <br />
            ${options.address_2}
          </div>
          <div class="details-phone">
            ${options.phone}
          </div>
          <div class="details-yelp">
            <a href="${options.yelp_url}" alt="${options.title} on Yelp">
              <button type="button" class="btn btn-yelp">View on Yelp</button>
            </a>
          </div>
          <button type="button" class="btn btn-eat-here">Eat Here!</button>
        </div>
      </div>
    `;

    return utilities.templateClean(template);
  }


  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = restaurantDetailsTmpl;
},{"../../utilities/utilities":34}],19:[function(require,module,exports){
// restaurantDetails

  // Dependencies
  const globals = require('../../globals');
  const restaurantDetailsTmpl = require('./restaurantDetails-tmpl');
  const pubSub = require('../../utilities/pubSub');

  // DOM
  let template = $(restaurantDetailsTmpl.generateTemplate());
  const component = '.js-restaurant-details';
  const btnEatHere = `${component} button.btn-eat-here`;
  const btnBack = `${component} .js-btn-back`;
  const templateOptions = {};

  // Subscribed Events
  // on image click in restaurantChoose, pass the current restaurant in
  // and show the details view
  pubSub.on('showDetailsView', handleShowDetailsView);
  pubSub.on('destroyDetailsView', handleDestroyDetailsView);

  function handleBtnBackClicked() {
    console.log('handleBtnBackClicked');
    destroy();
  }

  // handleShowDetailsView:
  // destroys currently shown template
  // sets template options to currentRestaurant
  // re-renders component
  function handleShowDetailsView(currentRestaurant) {
    console.log('handleShowDetailsView');
    destroy();
    setTemplateOptions(currentRestaurant);
    render();
  }

  // handleDestroyDetailsView:
  // if the component is shown, destroy it, else do nothing
  function handleDestroyDetailsView() {
    console.log('handleDestroyDetailsView');
    destroy();
  }

  // setTemplateOptions:
  // sets template options to received current restaurant
  function setTemplateOptions(restaurant) {
    templateOptions.title = restaurant.name;
    templateOptions.rating = restaurant.rating;
    templateOptions.price = restaurant.price;
    templateOptions.img_src = restaurant.image_url;
    templateOptions.img_alt = restaurant.name;
    templateOptions.address_1 = restaurant.location.display_address[0];
    templateOptions.address_2 = restaurant.location.display_address[1];
    templateOptions.phone = restaurant.display_phone;
    templateOptions.yelp_url = restaurant.url;
  }

  function assignEventHandlers() {
    globals.APP_CONTAINER.on('click', btnBack, handleBtnBackClicked);
  }

  // render:
  // render the component
  function render() {
    console.log('restaurantDetails render');
    template = $(restaurantDetailsTmpl.generateTemplate(templateOptions));
    globals.APP_CONTAINER.append(template);
    assignEventHandlers();
  }

  // destroy:
  // remove component from DOM
  function destroy() {
    if($(component).length) {
      console.log('restaurantDetails destroy');
      $(component).remove();
    }
  }
},{"../../globals":29,"../../utilities/pubSub":33,"./restaurantDetails-tmpl":18}],20:[function(require,module,exports){
module.exports = {
  restaurantLists: require('./restaurantLists'),
  restaurantListsTmpl: require('./restaurantLists-tmpl')
};
},{"./restaurantLists":22,"./restaurantLists-tmpl":21}],21:[function(require,module,exports){
// restaurantLists-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  // generateTemplate:
  // this template generation is different due to the fact that it calls a function
  // inside the literal to generate the list based on an array from the options
  function generateTemplate(options) {

    options = options || "";
    // pass in title and array (list) to options

    const template = `
      <div class="js-restaurant-list le-restaurant-list col-xs-12 col-md-8 col-md-offset-2">
      <h3>${options.title}</h3>
      <span class="empty-list-message">Search to add items to your ${options.title} list!</span>
        <ul>
          ${buildListFromArray(options.list)}
        </ul>
      </div>
    `;

    return utilities.templateClean(template);
  }

  // buildListFromArray:
  // iterates through passed in array to build a list element for each item
  function buildListFromArray(array) {
    console.log('buildListFromArray');
      let listTemplate = "";

      array.forEach(function(object) {
        listTemplate = listTemplate + `
        <li>${object.name}
          <a href="#" data-id="${object.id}">x</a>
        </li>
        `;
      });

      return listTemplate;
  }

module.exports = {
  generateTemplate: generateTemplate
};
},{"../../utilities/utilities":34}],22:[function(require,module,exports){
// restaurantLists

  // Dependencies
  const globals = require('../../globals');
  const utilities = require('../../utilities/utilities'); // for makeDbRequest
  const pubSub = require('../../utilities/pubSub');
  const restaurantListsTmpl = require('./restaurantLists-tmpl');

  // DOM
  const component = '.js-restaurant-list';
  // let template = $(restaurantListsTmpl.generateTemplate());
  const emptyListMsg = `${component} .empty-list-message`;
  const templateOptions = {};
  const deleteButton = `${component} li a`;

  // Subscribed Events
  pubSub.on('renderRestaurantList', handleRenderRestaurantList);
  pubSub.on('renderRestaurantSearch', destroy);
  pubSub.on('renderRestaurantChoose', destroy);


  // module variables
  let currentList = {};

  function handleRenderRestaurantList(dataReceived) {
    console.log('dataReceived', dataReceived);

    // remove from dom if it already exists
    destroy();
    
    let listToDisplay = []; 

    if(dataReceived) { 
      currentList = dataReceived; 
    }
    
    // get list from users based on nav item clicked
    utilities.makeDbRequest('GET', currentList.itemClicked).then(function(data) {
      listToDisplay = data;
      console.log('listToDisplay', listToDisplay);

      templateOptions.title = currentList.itemClicked;
      templateOptions.list = listToDisplay;
      console.log('templateOptions', templateOptions);
      render();

      if(listToDisplay.length === 0) {
        $('.js-restaurant-list span').toggleClass('empty-list-message-visible');
      }

    }).catch(function(err) {
      console.log(err);
    });

  }

  function handleDeleteButtonClicked(event) {
    event.preventDefault();
    console.log('handleDeleteButtonClicked');

    const arrayToDelFrom = templateOptions.title;
    const itemToDelete = $(this).attr('data-id');

    const data = {
      arrayToDelFrom: arrayToDelFrom,
      itemToDelete: itemToDelete
    };

    utilities.makeDbRequest('DELETE', data).then(function(data) {
      console.log('delete request completed');
      destroy();
      pubSub.emit('renderRestaurantList');
    }).catch(function(err) {
      console.log(err);
    });

    
  }

  function assignEventHandlers() {
    globals.APP_CONTAINER.on('click', deleteButton, handleDeleteButtonClicked);
  }

  function render() {
    console.log('restaurantLists render');
    let template = $(restaurantListsTmpl.generateTemplate(templateOptions));
    globals.APP_CONTAINER.append(template);
  }

  function destroy() {
    if($(component).length) {
      console.log('restaurantLists destroy');
      $(component).remove();
    }
  }

  assignEventHandlers();
},{"../../globals":29,"../../utilities/pubSub":33,"../../utilities/utilities":34,"./restaurantLists-tmpl":21}],23:[function(require,module,exports){
module.exports = {
  restaurantSearch: require('./restaurantSearch'),
  restaurantSearchTmpl: require('./restaurantSearch-tmpl')
};
},{"./restaurantSearch":25,"./restaurantSearch-tmpl":24}],24:[function(require,module,exports){
// restaurantSearch-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');
  

  // TODO: for cuisine selections, have an array of cuisines and for each item
  // in the array, create the html option element for it and add it to the template
  // Probably has to be a separate function, then a function to combine the two
  // templates
  // TODO: uncomment cuisine when I add support with the yelp api
  function generateTemplate() {
    const template = `
      <div class="le-restaurant-search js-restaurant-search">
        <ol class="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3">
          <li>Enter zipcode</li>
          <li>Select search radius</li>
          <li>Want restaurants you haven't been to? Check 'Try something new' (if used app a few times)</li>
          <li>"Let's Eat!"</li>
        </ol>
        <span class="fields-empty-message col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3">Please fill out all required fields (Location & Radius)</span>
        <form id="restaurant-search">
          <label for="input-location"><span class="input-label">Location</span>
            <input class="js-input-location col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 type="number" id="input-location" name="location" pattern="[0-9]*" placeholder="Location (zipcode)" required>
          </label>

          <label for="select-radius"><span class="input-label">Radius</span>
            <select class="js-select-radius col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3" name="radius" id="select-radius" required>
              <option value="" disabled selected>Select a radius &#9660;</option>
              <option value="5">5mi</option>
              <option value="10">10mi</option>
              <option value="15">15mi</option>
              <option value="20">20mi</option>
              <option value="25">25mi</option>
            </select>
          </label>

          <!--
          <label for="select-cuisine">Cuisine (optional)
            <select class="js-select-cuisine col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3" name="cuisine" id="select-cuisine">
              <option value="" disabled selected>Select a cuisine</option>
              <option value="italian">Italian</option>
              <option value="american">American</option>
              <option value="mexican">Mexican</option>
              <option value="asian">Asian</option>
              <option value="burgers">Burgers</option>
            </select>
          </label>
          -->

          <label for="input-try-new" class="try-new col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3">Try something new?
            <input class="js-input-try-new" type="checkbox" id="input-try-new" name="try-new">
          </label>

          <button type="submit" class="btn btn-submit js-btn-submit col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3">Let's Eat!</button>

        </form>
      </div>
    `;

    // remove line breaks,
    // remove whitespace between element tags, 
    // remove leading and trailing whitespace
    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};
},{"../../utilities/utilities":34}],25:[function(require,module,exports){
// restaurantSearch

  // Dependencies
  const globals = require('../../globals');
  const pubSub = require('../../utilities/pubSub');
  const restaurantSearchTmpl = require('./restaurantSearch-tmpl');

  // DOM
  const componentContainer = globals.APP_CONTAINER.find('.js-restaurant-search-container');
  const component = '.js-restaurant-search';
  const template = $(restaurantSearchTmpl.generateTemplate());
  const btnSearch = $('.js-btn-submit', template); 
  const btnTest = $('.button-test', template);
  const fieldsEmptyMsg = `${component} .fields-empty-message`;

  // Subscribed Events
  pubSub.on('renderRestaurantSearch', handleRenderRestaurantSearch);
  pubSub.on('renderRestaurantList', destroy);
  
  // handleRenderRestaurantSearch:
  // used when receiveing the emitted event when clicking back button from a different component
  function handleRenderRestaurantSearch() {
    render();
  }

  // handleSearchBtnClicked: Handle clicking the search button
  // TODO: handle 'new restaurants only'
  function handleSearchBtnClicked(event) {
    console.log('handleSearchBtnClicked');

    event.preventDefault();

    // doing this instead of passing directly to getDataFromApi allows me
    // to still check and access the tryNew param without re-calling the function getFormValues
    const formValues = getFormValues(); 
    console.log('formValues', formValues);

    if(formValues.location === "" || isNaN(formValues.radius)) {
      console.log('Please fill out all form values');
      $(fieldsEmptyMsg).css('display', 'inline-block');

    } else {
      $(fieldsEmptyMsg).css('display', 'none');
      getDataFromApi(formValues, processSearchResults);  
      
      // remove component from dom
      destroy();

      pubSub.emit('renderLoader');
    }
  }

  // getDataFromApi: request yelp search data via my own api
  // TODO: pass in value for cuisine from form to yelp api
  // TODO: access control for this via app_id and app_key? or user logged in?
  function getDataFromApi(queryParams, callback) {
    console.log('getDataFromApi');

    const settings = {
      url: '/restaurant-search/',
      data: {
        "term": "food",
        "location": queryParams.location,
        "radius": queryParams.radius,
        "limit": 50
      },
      dataType: 'json',
      type: 'GET',
      success: callback
    };
    $.ajax(settings);
  }

  // processSearchResults: do stuff with the data returned from getDataFromApi (the yelp search results)
  function processSearchResults(data) {
    console.log('processSearchResults');

    // Pass tryNew value to emitter for use in restaurantChoose
    const tryNew = getFormValues().tryNew;
    
    // process the data ->
    //   remove any yelpevents results

    // emit event with processed data
    // received in: 
    //   restaurantChoose

    pubSub.emit('processSearchResults', {data: data, tryNew: tryNew});
  }

  // getFormValues: get values from form input fields and returns as an object
  function getFormValues() {
    console.log('getFormValues');

    return {
      location: $('.js-input-location', template).val(),
      radius: _convertMilesToMeters(parseInt($('.js-select-radius', template).val())),
      cuisine: $('.js-select-cuisine', template).val(),
      tryNew: $('.js-input-try-new', template).is(':checked')
    }
  }



   // _convertMilesToMeters: helper function to convert miles to meters
  function _convertMilesToMeters(miles) {
    console.log('convertMilesToMeters');
    
    const oneMeter = 1609.34;
    return Math.floor(miles * oneMeter);
  }



  // assignEventHandlers: assigns event handlers for component events
  function assignEventHandlers() {
    console.log('assignEventHandlers');
    btnSearch.on('click', handleSearchBtnClicked);
  }

  // render the element to the page
  function render() {
    console.log('restaurantSearch render');
    componentContainer.append(template);
    assignEventHandlers();
  }

  // destroy:
  // remove component from dom
  function destroy() {
    if($(component).length) {
      console.log('restaurantSearch destroy'); 
      $(component).remove();
      // $(component).detach();
      // can either .detach() which keeps event handlers
      // or can .remove() and re-run assignEventHandlers() in render()
    }
  }



  // test function for checking values
  function test() {
    console.log('template', template);
    console.log('btnSearch', btnSearch);
    console.log('getFormValues', getFormValues());
  }

  // on initial load:
  //   render the template
  //   bind events
  // render();
  // assignEventHandlers();

  function runApp() {
    console.log('runApp');
    render();
  }

module.exports = {
  render: render,
  assignEventHandlers: assignEventHandlers,
  test: test,
  runApp: runApp
};
},{"../../globals":29,"../../utilities/pubSub":33,"./restaurantSearch-tmpl":24}],26:[function(require,module,exports){
module.exports = {
  restaurantVisited: require('./restaurantVisited'),
  restaurantVisitedTmpl: require('./restaurantVisited-tmpl')
};
},{"./restaurantVisited":28,"./restaurantVisited-tmpl":27}],27:[function(require,module,exports){
// restaurantVisited-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="js-restaurant-visited le-restaurant-visited">
        <div>
          <button type="button">I'd go here again</button>
          <button>I wouldn't go back</button>
        </div>
      </div><!-- / le-restaurant-visited -->
    `;

    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};
},{"../../utilities/utilities":34}],28:[function(require,module,exports){
// restaurantVisited

  // Dependencies
  const globals = require('../../globals');
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');
  const utilities = require('../../utilities/utilities'); // for makeDbRequest
  const pubSub = require('../../utilities/pubSub');

  // DOM
  let template = $(restaurantVisitedTmpl.generateTemplate());
  const component = '.js-restaurant-visited';
  const btnGoBack = `${component} button:nth-child(1)`;
  const btnNotGoBack = `${component} button:nth-child(2)`;

  // Subscribed Events
  // Received from restaurantChoose on already been here button click
  pubSub.on('displayVisitedPopup', handleReceivedPopupData);

  // Module variables. Used for received data via event subscription.
  let currentUser = {};
  let currentRestaurant = {};

  // set up an object for db insertion based on schema
  let objForInsert = {};

  // handleReceivedPopupData:
  // set the local data equal to received data so it can be passed around in the module
  // show the component
  function handleReceivedPopupData(data) {
    console.log('handleVisitedPopupShown');
    
    // reset local data on popup activated
    currentUser = {};
    currentRestaurant = {};

    // set local data equal to received data from showing popup via click
    currentUser = data.user;
    currentRestaurant = data.restaurant;
    objForInsert = {
      id: currentRestaurant.id, 
      name: currentRestaurant.name, 
      price: currentRestaurant.price, 
      rating: currentRestaurant.rating, 
      url: currentRestaurant.url, 
      image_url: currentRestaurant.image_url
    };

    showComponent();
  }

  // handleBtnGoBackClicked:
  // updates the current user history and liked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnGoBackClicked() {
    console.log('handleBtnGoBackClicked');

    console.log('currentRestaurant', currentRestaurant);

    // Add restaurant to history list and liked list

    let data = {
      "history" : objForInsert,
      "liked": objForInsert
    };

    utilities.makeDbRequest('PUT', data).then(function(data) {
      pubSub.emit('showNextSearchResult');
    }).catch(function(err) {
      console.log(err);
    });
  }

  // handleBtnNotGoBackClicked:
  // updates the current user history and disliked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnNotGoBackClicked() {
    console.log('handleBtnNotGoBackClicked');

    // Add restaurant to history list and liked list
    let data = {
      "history" : objForInsert,
      "disliked" : objForInsert
    };

    utilities.makeDbRequest('PUT', data).then(function(data) {
      hideComponent();
      pubSub.emit('showNextSearchResult');
    }).catch(function(err) {
      console.log(err);
    });
  }

  function assignEventHandlers() {
    console.log('restaurantVisited assignEventHandlers');
    globals.APP_CONTAINER.on('click', btnGoBack, handleBtnGoBackClicked);
    globals.APP_CONTAINER.on('click', btnNotGoBack, handleBtnNotGoBackClicked);
  }

  function showComponent() {
    $(component).css("display", "block");
  }

  function hideComponent() {
    $(component).css("display", "none");
  }

  // component starts out hidden via css
  assignEventHandlers();
},{"../../globals":29,"../../utilities/pubSub":33,"../../utilities/utilities":34,"./restaurantVisited-tmpl":27}],29:[function(require,module,exports){
module.exports = {
  APP_CONTAINER: $('#le-app'),
  NAV_CONTAINER: $('nav')
};
},{}],30:[function(require,module,exports){
module.exports = {
  userModel: require('./userModel')
};
},{"./userModel":31}],31:[function(require,module,exports){
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
},{"uuid":1}],32:[function(require,module,exports){
module.exports = {
  pubSub: require('./pubSub'),
  utilities: require('./utilities')
};
},{"./pubSub":33,"./utilities":34}],33:[function(require,module,exports){
// pubSub
  
  // object that holds events, none created by default
  const events = {};

  // on:
  // if the event doesn't exist, create an empty array
  // add handler fn to events array at eventName
  function on(eventName, fn) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(fn);
  }

  // off:
  // if eventName exists in events, if fn exists, remove function from array
  function off(eventName, fn) {
    if(events[eventName]) {
      for(let i = 0; i < events[eventName].length; i++) {
        // if(events[eventName][i] === fn) {
        if(events.indexOf(i) === fn) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  // if eventName exists, pass data to each fn in the array while calling each fn
  function emit(eventName, data) {
    if(events[eventName]) {
      events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }

module.exports = {
  on: on,
  off: off,
  emit: emit
};
},{}],34:[function(require,module,exports){
// utilities
  
  // templateClean:
  // remove line breaks,
  // remove whitespace between element tags, 
  // remove leading and trailing whitespace
  function templateClean(template) {
    return template.replace(/(\r\n|\n|\r)/gm,"").replace(/>\s+</g,'><').trim(); 
  }

  // randomIntBetweenNums:
  // generates a random integer between a min and max value
  function randomIntBetweenNums(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Fisher-Yates Shuffle
  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  function shuffleArray(array) {
    let counter = array.length;

    while(counter > 0) {
      // random index with max of counter (array length)
      let index = Math.floor(Math.random() * counter);

      // decrease counter
      counter--;

      // temp is set to array item at decreased counter
      let temp = array[counter];

      // array item at decreased counter index is set to array at random index
      array[counter] = array[index];

      // array at random index is set to temp value
      array[index] = temp;
    }

    return array;
  }

  // makeDbRequest:
  // make a request to the mongo db
  // pass in a data object
  // supports GET and PUT operations
  function makeDbRequest(requestType, data) {
    return new Promise(function(resolve, reject) {
      const settings = {
        url: '/userdata',
        dataType: 'json',
        data: {},
        type: requestType,
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(err);
        }
      };

      if(requestType === 'GET') {
        console.log('requestType', requestType);
        // data === 'history', 'liked', 'disliked'...
        settings.data.arrayToGet = data;
      }
      // data === {'history': objToInsert, 'liked': objToInsert}
      if(requestType === 'PUT') {
        console.log('requestType', requestType);
        settings.data = data;
        console.log('put data', data);
        console.log('settings.data', settings.data);
      }
      if(requestType === 'DELETE') {
        console.log('requestType', requestType);
        settings.url = `/userdata/${data.arrayToDelFrom}/${data.itemToDelete}`;
        // settings.data = data;
        // console.log('settings.data', settings.data);
      }
      $.ajax(settings);
    });
  }

module.exports = {
  templateClean: templateClean,
  randomIntBetweenNums: randomIntBetweenNums,
  shuffleArray: shuffleArray,
  makeDbRequest: makeDbRequest
};
},{}]},{},[6]);

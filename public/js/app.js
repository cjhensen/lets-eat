(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const leUtilities = require('./utilities');
const components = require('./components');

components.restaurantSearch.restaurantSearch.runApp();
console.log('components built', components, leUtilities);
},{"./components":2,"./utilities":12}],2:[function(require,module,exports){
module.exports = {
  restaurantChoose: require('./restaurantChoose'),
  restaurantSearch: require('./restaurantSearch'),
  restaurantVisited: require('./restaurantVisited')
};
},{"./restaurantChoose":3,"./restaurantSearch":6,"./restaurantVisited":9}],3:[function(require,module,exports){
module.exports = {
  restaurantChoose: require('./restaurantChoose'),
  restaurantChooseTmpl: require('./restaurantChoose-tmpl')
};
},{"./restaurantChoose":5,"./restaurantChoose-tmpl":4}],4:[function(require,module,exports){
const restaurantChooseTmpl = (function() {

  // modules:
  // _utilities
  const _utilities = require('../../utilities/utilities');


  function generateTemplate(options) {

    // options:
    // title, rating, img_src, img_alt, restaurantVisitedComponent
    options = options || "";

    const template = `
      <div class="js-restaurant-choose">
        <div class="info-place">
          <h4 class="js-title">${options.title}</h4>
          <span class="js-rating rating-stars">${options.rating}</span>
        </div>
        <div class="img-place">
          <img class="js-img" src="${options.img_src}" alt="${options.img_alt}">
        </div>
        <div class="choose-controls">
          <button type="button" class="btn">Eat Here!</button>
          <button type="button" class="btn">Already been here</button>
          <button type="button" class="btn js-btn-next">Not feeling this place</button>
        </div><!-- / choose-controls -->

        <!-- insert restaurantVisited component -->
        ${options.restaurantVisitedComponent}
      </div>
      `;

      return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = restaurantChooseTmpl;
},{"../../utilities/utilities":14}],5:[function(require,module,exports){
const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub
  // restaurantVisitedTmpl
  // utilities: shuffleArray
  const _utilities = require('../../utilities/utilities');
  const pubSub = require('../../utilities/pubSub');

  // Dependencies
  const restaurantChooseTmpl = require('./restaurantChoose-tmpl');

  // DOM
  const componentElementSelector = $('.js-restaurant-choose-container');
  let template = $(restaurantChooseTmpl.generateTemplate());
  const btnNextResult = $('.js-btn-next', template);
  const templateOptions = {};

  // Embedded Components
  // let restaurantVisitedComponent = restaurantVisitedTmpl.generateTemplate();
  // templateOptions.restaurantVisitedComponent = restaurantVisitedComponent;
  // console.log('restaurantVisitedComponent', restaurantVisitedComponent);
  // let restaurantVisitedComponent = $(restaurantVisitedTmpl.generateTemplate());


  // subscribed events
  // first set the local data to the received data
  pubSub.on('processSearchResults', handleReceivedSearchResults);
  // then populate the serach result on the page
  pubSub.on('processSearchResults', populateSearchResult);

  // module variables
  let localSearchResultData = [];
  let currentSearchResultIndex = 0;

  // handleNextBtnClicked:
  // show a different result when user clicks next btn ('Not feeling this place')
  function handleNextBtnClicked() {
    console.log('handleNextBtnClicked');
    populateSearchResult();
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
    localSearchResultData = searchResultData;

    // shuffle localSearchResultData for showing a random result
    // is it better to only shuffle indexes? 
    _utilities.shuffleArray(localSearchResultData);
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

      // increment index for next result
      currentSearchResultIndex++;

      render();

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
    componentElementSelector.on('click', btnNextResult, handleNextBtnClicked);
  }

  // render the view to the page
  function render() {
    console.log('restaurantChoose render');
    template = $(restaurantChooseTmpl.generateTemplate(templateOptions));
    componentElementSelector.html(template);
    // componentElementSelector.append(restaurantVisitedComponent);
  }

  assignEventHandlers();

  return {
    render: render
  }

})();

module.exports = restaurantChoose;
},{"../../utilities/pubSub":13,"../../utilities/utilities":14,"./restaurantChoose-tmpl":4}],6:[function(require,module,exports){
module.exports = {
  restaurantSearch: require('./restaurantSearch'),
  restaurantSearchTmpl: require('./restaurantSearch-tmpl')
};
},{"./restaurantSearch":8,"./restaurantSearch-tmpl":7}],7:[function(require,module,exports){
const restaurantSearchTmpl = (function() {

  // modules:
  // _utilities
  const _utilities = require('../../utilities/utilities');
  

  // TODO: for cuisine selections, have an array of cuisines and for each item
  // in the array, create the html option element for it and add it to the template
  // Probably has to be a separate function, then a function to combine the two
  // templates
  // TODO: uncomment cuisine when I add support with the yelp api
  function generateTemplate() {
    const template = `
      <form id="restaurant-search" class="js-restaurant-search">
        <label for="input-location">Location
          <input class="js-input-location" type="number" id="input-location" name="location" pattern="[0-9]*" required>
        </label>

        <label for="select-radius">Radius
          <select class="js-select-radius" name="radius" id="select-radius" required>
            <option value="" disabled selected>Select a radius</option>
            <option value="5">5mi</option>
            <option value="10">10mi</option>
            <option value="15">15mi</option>
            <option value="20">20mi</option>
            <option value="25">25mi</option>
          </select>
        </label>

        <!--
        <label for="select-cuisine">Cuisine (optional)
          <select class="js-select-cuisine" name="cuisine" id="select-cuisine">
            <option value="" disabled selected>Select a cuisine</option>
            <option value="italian">Italian</option>
            <option value="american">American</option>
            <option value="mexican">Mexican</option>
            <option value="asian">Asian</option>
            <option value="burgers">Burgers</option>
          </select>
        </label>
        -->

        <label for="input-try-new" class="try-new">Try something new?
          <input class="js-input-try-new" type="checkbox" id="input-try-new" name="try-new">
        </label>

        <button type="submit" class="btn btn-submit js-btn-submit">Let's Eat!</button>

      </form>
    `;

    // remove line breaks,
    // remove whitespace between element tags, 
    // remove leading and trailing whitespace
    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = restaurantSearchTmpl;
},{"../../utilities/utilities":14}],8:[function(require,module,exports){
const restaurantSearch = (function() {

  // modules:
  // restaurantSearchTmpl
  // pubSub
  const pubSub = require('../../utilities/pubSub');

  // Dependencies
  const restaurantSearchTmpl = require('./restaurantSearch-tmpl');

  // DOM
  const componentElementSelector = $('.js-restaurant-search-container');
  const template = $(restaurantSearchTmpl.generateTemplate());
  const btnSearch = $('.js-btn-submit', template); 


  // handleSearchBtnClicked: Handle clicking the search button
  // TODO: handle 'new restaurants only'
  function handleSearchBtnClicked(event) {
    console.log('handleSearchBtnClicked');

    event.preventDefault();

    // doing this instead of passing directly to getDataFromApi allows me
    // to still check and access the tryNew param without re-calling the function getFormValues
    const formValues = getFormValues(); 
    getDataFromApi(formValues, processSearchResults);
  }

  // getDataFromApi: request yelp search data via my own api
  // TODO: pass in value for cuisine from form to yelp api
  // TODO: access control for this via app_id and app_key? or user logged in?
  function getDataFromApi(queryParams, callback) {
    console.log('getDataFromApi');

    const settings = {
      url: 'http://localhost:8080/restaurant-search/',
      data: {
        "term": "food",
        "location": queryParams.location,
        "radius": queryParams.radius,
        "limit": 5
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
    // process the data -> remove results based on 'tryNew' option
    //   remove any yelpevents results

    // emit event with processed data
    // received in: 
    //   restaurantChoose
    pubSub.emit('processSearchResults', data);
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
    componentElementSelector.append(template);
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
    assignEventHandlers();
  }

  return {
    render: render,
    assignEventHandlers: assignEventHandlers,
    test: test,
    runApp: runApp
  }

})();

module.exports = restaurantSearch;
},{"../../utilities/pubSub":13,"./restaurantSearch-tmpl":7}],9:[function(require,module,exports){
module.exports = {
  restaurantVisited: require('./restaurantVisited'),
  restaurantVisitedTmpl: require('./restaurantVisited-tmpl')
};
},{"./restaurantVisited":11,"./restaurantVisited-tmpl":10}],10:[function(require,module,exports){
const restaurantVisitedTmpl = (function() {

  const _utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="js-restaurant-visited le-restaurant-visited">
        My visited template
      </div><!-- / le-restaurant-visited -->
    `;

    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }
  
})();

module.exports = restaurantVisitedTmpl;
},{"../../utilities/utilities":14}],11:[function(require,module,exports){
const restaurantVisited = (function() {

  // Dependencies
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');

  const componentElementSelector = $('.js-restaurant-visited-container');
  let template = $(restaurantVisitedTmpl.generateTemplate());

  function render() {
    componentElementSelector.html(template);
  }

  // render();
  return {
    render: render
  }
})();

module.exports = restaurantVisited;
},{"./restaurantVisited-tmpl":10}],12:[function(require,module,exports){
module.exports = {
  pubSub: require('./pubSub'),
  utilities: require('./utilities')
};
},{"./pubSub":13,"./utilities":14}],13:[function(require,module,exports){
const pubSub = (function() {
  
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

  return {
    on: on,
    off: off,
    emit: emit
  }

})();

module.exports = pubSub;
},{}],14:[function(require,module,exports){
const _utilities = (function() {
  
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

  return {
    templateClean: templateClean,
    randomIntBetweenNums: randomIntBetweenNums,
    shuffleArray: shuffleArray
  }

})();

module.exports = _utilities;
},{}]},{},[1]);

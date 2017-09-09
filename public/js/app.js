
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

  return {
    templateClean: templateClean,
    randomIntBetweenNums: randomIntBetweenNums
  }

})();
const restaurantChooseTmpl = (function() {

  // modules:
  // _utilities


  function generateTemplate(options) {

    // options
    // title, rating, img_src, img_alt
    options = options || "";

    const template = `
      <div>
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
      </div>
      `;

      return _utilities.templateClean(template);
  };

  return {
    generateTemplate: generateTemplate
  }

})();
const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub
  // utilities


  // DOM
  const componentElementSelector = $('.js-restaurant-choose');
  let template = $(restaurantChooseTmpl.generateTemplate());
  const btnNextResult = $('.js-btn-next', template);
  const templateOptions = {};


  // subscribed events
  // first set the local data to the received data
  pubSub.on('processSearchResults', handleReceivedSearchResults);
  // then populate the serach result on the page
  pubSub.on('processSearchResults', populateSearchResult);

  // module variables
  let localSearchResultData = [];

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
    
    // reset local data on new search
    localSearchResultData = [];

    // set local data equal to received search result data
    localSearchResultData = searchResultData;
  }

  // populateSearchResult:
  // fill in template with local copy of search result data,
  // then render
  // Note* I am not handling the data being received in the pubsub for this function (no parameter)
  function populateSearchResult() {
    console.log('populateSearchResult');

    console.log('localSearchResultData', localSearchResultData);

    // select random number from 0 to 49 (max results returned from API)
    // TODO: keep track of chosen random numbers
    let index = _utilities.randomIntBetweenNums(0, 4);
    console.log('index', index);

    templateOptions.title = localSearchResultData[index].name;
    templateOptions.rating = localSearchResultData[index].rating;
    templateOptions.img_src = localSearchResultData[index].image_url;
    templateOptions.img_alt = localSearchResultData[index].name;

    console.log('templateOptions', templateOptions);

    render();
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
  }

  assignEventHandlers();

  return {
    render: render
  }

})();
const restaurantSearchTmpl = (function() {

  // modules:
  // _utilities
  

  // TODO: for cuisine selections, have an array of cuisines and for each item
  // in the array, create the html option element for it and add it to the template
  // Probably has to be a separate function, then a function to combine the two
  // templates
  // TODO: uncomment cuisine when I add support with the yelp api
  function generateTemplate() {
    const template = `
      <form id="restaurant-search">
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

const restaurantSearch = (function() {

  // modules:
  // restaurantSearchTmpl
  // pubSub


  // DOM
  const componentElementSelector = $('.js-restaurant-search');
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
  render();
  assignEventHandlers();

  return {
    render: render,
    assignEventHandlers: assignEventHandlers,
    test: test
  }

})();
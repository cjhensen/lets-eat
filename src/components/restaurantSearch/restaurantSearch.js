const restaurantSearch = (function() {

  // Dependencies
  const pubSub = require('../../utilities/pubSub');
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
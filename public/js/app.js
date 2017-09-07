

const restaurantSearchTmpl = (function() {
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
    return template.replace(/(\r\n|\n|\r)/gm,"").replace(/>\s+</g,'><').trim();
  }

  return {
    generateTemplate: generateTemplate
  }

})();

const restaurantSearch = (function() {

  // DOM
  const element = $('.js-restaurant-search');
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
    console.log('data', data);
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
    element.append(template);
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
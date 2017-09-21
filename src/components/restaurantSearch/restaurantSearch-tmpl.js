const restaurantSearchTmpl = (function() {

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
      </div>
    `;

    // remove line breaks,
    // remove whitespace between element tags, 
    // remove leading and trailing whitespace
    return utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = restaurantSearchTmpl;
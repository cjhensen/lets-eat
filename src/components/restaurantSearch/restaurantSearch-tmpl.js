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
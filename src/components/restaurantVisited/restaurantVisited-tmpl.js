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
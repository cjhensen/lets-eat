const restaurantVisitedTmpl = (function() {

  // Dependencies
  // _utilities.templateClean
  const _utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="js-restaurant-visited le-restaurant-visited">
        <button type="button">I'd go here again</button>
        <button>I wouldn't go back</button>
      </div><!-- / le-restaurant-visited -->
    `;

    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }
  
})();

module.exports = restaurantVisitedTmpl;
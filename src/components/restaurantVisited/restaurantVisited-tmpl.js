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
const restaurantChooseTmpl = (function() {

  // Dependencies
  // _utilities.templateClean
  const _utilities = require('../../utilities/utilities');


  function generateTemplate(options) {

    // options:
    // title, rating, img_src, img_alt, restaurantVisitedComponent
    options = options || "";

    const template = `
      <div class="js-restaurant-choose le-restaurant-choose">
        <button type="button" class="btn btn-back js-btn-back">Back</button>
        <div class="info-place">
          <h4 class="js-title">${options.title}</h4>
          <span class="js-rating rating-stars">${options.rating}</span>
        </div>
        <div class="img-place">
          <a href="#" class="js-link-show-details">
            <img class="js-img" src="${options.img_src}" alt="${options.img_alt}">
          </a>
        </div>
        <div class="choose-controls">
          <button type="button" class="btn">Eat Here!</button>
          <button type="button" class="btn js-btn-already-visited">Already been here</button>
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
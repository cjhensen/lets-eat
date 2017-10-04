// restaurantChoose-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');


  function generateTemplate(options) {

    // options:
    // title, rating, img_src, img_alt, restaurantVisitedComponent
    options = options || "";

    const template = `
      <div class="js-restaurant-choose le-restaurant-choose">
        <div class="col-xs-12 col-md-4 col-md-offset-4">
          <button type="button" class="btn btn-back js-btn-back">Back</button>
        </div>
        <div class="info-place col-xs-12 col-md-4 col-md-offset-4">
          <h4 class="js-title">${options.title}</h4>
          <span class="js-rating rating-stars">${options.rating} stars</span>
        </div>
        <div class="img-place col-xs-12 col-md-4 col-md-offset-4">
          <img class="js-img" src="${options.img_src}" alt="${options.img_alt}">
        </div>
        <div class="choose-controls clearfix">
          <button type="button" class="btn js-btn-eat col-xs-12 col-md-4 col-md-offset-4">Eat Here!</button>
          <button type="button" class="btn js-btn-already-visited col-xs-12 col-md-4 col-md-offset-4">Already been here</button>
          <button type="button" class="btn js-btn-next col-xs-12 col-md-4 col-md-offset-4">Not feeling this place</button>
        </div><!-- / choose-controls -->

        <!-- insert restaurantVisited component -->
        ${options.restaurantVisitedComponent}
      </div>
      `;

      return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};
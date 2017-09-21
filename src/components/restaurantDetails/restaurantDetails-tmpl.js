const restaurantDetailsTmpl = (function() {
  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  function generateTemplate(options) {

    options = options || "";
    // title, rating, price, img_src, img_alt, address, phone, yelp_url
    console.log('optionssss', options);

    const template = `
      <div class="js-restaurant-details le-restaurant-details">
        <button type="button" class="btn btn-back js-btn-back">Back</button>
        <div class="top-info">
          <span class="details-title">${options.title}</span>
          <span class="details-rating">${options.rating}</span>
          <span class="details-price">${options.price}</span>
        </div>
        <div class="details-img">
          <img src="${options.img_src}" alt="${options.img_alt}">
        </div>
        <div class="bottom-info">
          <div class="details-address">
            ${options.address_1}
            <br />
            ${options.address_2}
          </div>
          <div class="details-phone">
            ${options.phone}
          </div>
          <div class="details-yelp">
            <a href="${options.yelp_url}" alt="${options.title} on Yelp">
              <button type="button" class="btn btn-yelp">View on Yelp</button>
            </a>
          </div>
          <button type="button" class="btn btn-eat-here">Eat Here!</button>
        </div>
      </div>
    `;

    return utilities.templateClean(template);
  }


  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = restaurantDetailsTmpl;
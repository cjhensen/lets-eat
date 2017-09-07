const restaurantChooseTmpl = (function() {

  // modules:
  // _utilities


  function generateTemplate() {
    const template = `
      <div>
        <div class="info-place">
          <h4 class="js-title">Title</h4>
          <span class="js-rating rating-stars"></span>
        </div>
        <div class="img-place">
          <img class="js-img" src="#" alt="">
        </div>
        <div class="choose-controls">
          <button type="button" class="btn">Eat Here!</button>
          <button type="button" class="btn">Already been here</button>
          <button type="button" class="btn js-btn-next">Not feeling this place</button>
        </div><!-- / choose-controls -->
      </div>
      `;

      return _utilities.templateClean(template);
  };

  return {
    generateTemplate: generateTemplate
  }

})();
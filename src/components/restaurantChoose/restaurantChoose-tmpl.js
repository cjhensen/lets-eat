const restaurantChooseTmpl = (function() {

  function generateTemplate() {
    const template = `
      <div>
        <div class="info-place">
          <h4>Title</h4>
          <span class="rating-stars"></span>
        </div>
        <div class="img-place">
          <img src="#" alt="">
        </div>
        <div class="choose-controls">
          <button type="button" class="btn">Eat Here!</button>
          <button type="button" class="btn">Already been here</button>
          <button type="button" class="btn">Not feeling this place</button>
        </div><!-- / choose-controls -->
      </div>
      `;

      return _utilities.templateClean(template);
  };

  return {
    generateTemplate: generateTemplate
  }

})();
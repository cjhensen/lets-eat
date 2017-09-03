const generateRestaurantSearchTmpl = (function() {

  function generateTemplate() {
    const template = `
      <div class="myTemplate">some cool template text goes here!</div>
    `;

    return template.trim();
  }

  return {
    generateTemplate: generateTemplate
  }

})();

const restaurantVisitedTmpl = (function() {

  function generateTemplate() {
    const template = `
      <div>My visited template</div>
    `;

    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }
})();
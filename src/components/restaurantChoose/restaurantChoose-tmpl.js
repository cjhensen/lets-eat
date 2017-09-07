const restaurantChooseTmpl = (function() {

  function generateTemplate() {
    const template = `
      <div>Cool template!</div>
      `;

      return _utilities.templateClean(template);
  };

  return {
    generateTemplate: generateTemplate
  }
  
})();
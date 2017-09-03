
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

const restaurantSearch = (function() {

  const template = generateRestaurantSearchTmpl.generateTemplate();

  function render() {
    console.log('rendering');
    console.log('template', template);
  }

  return {
    render: render
  }

})();